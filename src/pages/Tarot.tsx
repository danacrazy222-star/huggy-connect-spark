import { useState, useRef, useEffect } from "react";
import { TopBar } from "@/components/TopBar";
import { useTranslation } from "@/hooks/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, RotateCcw } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { cn } from "@/lib/utils";
import { fullTarotDeck, type TarotCard } from "@/data/tarotDeck";
import madamZaraImg from "@/assets/madam-zara.png";
import cardBackImg from "@/assets/tarot-card-back.png";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tarot-reading`;
const MAX_CARDS = 3;
const DISPLAY_CARDS = 50;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function Tarot() {
  const [phase, setPhase] = useState<"landing" | "select" | "reading" | "chat">("landing");
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [shuffledDeck, setShuffledDeck] = useState<TarotCard[]>([]);
  const [userGender, setUserGender] = useState<string>("male");
  const { tarotTickets, addTarotTicket } = useGameStore();
  const { t, isRTL, language } = useTranslation();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("gender").eq("user_id", user.id).single()
      .then(({ data }) => { if (data?.gender) setUserGender(data.gender); });
  }, [user]);

  useEffect(() => {
    setShuffledDeck([...fullTarotDeck].sort(() => Math.random() - 0.5).slice(0, DISPLAY_CARDS));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startSession = () => {
    if (tarotTickets <= 0) return;
    setPhase("select");
  };

  const handleCardSelect = (card: TarotCard) => {
    if (selectedCards.find((c) => c.id === card.id)) {
      setSelectedCards((prev) => prev.filter((c) => c.id !== card.id));
      return;
    }
    if (selectedCards.length >= MAX_CARDS) return;
    setSelectedCards((prev) => [...prev, card]);
  };

  const getSelectionOrder = (cardId: number) => {
    const idx = selectedCards.findIndex((c) => c.id === cardId);
    return idx >= 0 ? idx + 1 : 0;
  };

  const startReading = async () => {
    if (selectedCards.length < MAX_CARDS || tarotTickets <= 0) return;
    addTarotTicket(-1);
    setPhase("reading");

    const cardNames = language === "ar"
      ? selectedCards.map(c => c.nameAr).join("، ")
      : selectedCards.map((c) => `${c.name} (${c.suit})`).join(", ");
    
    const userMsg: ChatMessage = {
      role: "user",
      content: language === "ar"
        ? `اخترت هذه البطاقات: ${cardNames}. أعطني قراءة.`
        : `I selected: ${cardNames}. Give me a reading.`,
    };
    setMessages([userMsg]);
    await streamResponse([userMsg]);
    setPhase("chat");
  };

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;
    const userMsg: ChatMessage = { role: "user", content: input.trim() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    await streamResponse(newMsgs);
  };

  const streamResponse = async (allMessages: ChatMessage[]) => {
    setIsStreaming(true);
    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages, selectedCards, language }),
      });

      if (!resp.ok) {
        if (resp.status === 429) toast({ title: t("tryAgain"), description: t("comeBackTomorrow"), variant: "destructive" });
        else toast({ title: t("tryAgain"), description: t("tryAgain"), variant: "destructive" });
        setIsStreaming(false);
        return;
      }

      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantText += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantText } : m);
                }
                return [...prev, { role: "assistant", content: assistantText }];
              });
            }
          } catch { /* partial json */ }
        }
      }
    } catch (e) {
      console.error(e);
      toast({ title: t("tryAgain"), description: t("tryAgain"), variant: "destructive" });
    }
    setIsStreaming(false);
  };

  const reset = () => {
    setSelectedCards([]);
    setMessages([]);
    setPhase("landing");
    setShuffledDeck([...fullTarotDeck].sort(() => Math.random() - 0.5).slice(0, DISPLAY_CARDS));
  };

  return (
    <div className="min-h-screen bg-premium-gradient stars-bg pb-20" dir={isRTL ? "rtl" : "ltr"}>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
        <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-accent shadow-gold">
            <img src={madamZaraImg} alt="Madam Zara" className="w-full h-full object-cover" />
          </div>
          <div className={cn(isRTL && "text-right")}>
            <h1 className="font-display text-sm font-bold text-gold-gradient">
              {t("madamZaraTitle")}
            </h1>
            <p className="text-[10px] text-accent">{t("mysteryReaderLabel")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {(phase === "select" || phase === "reading" || phase === "chat") && (
            <button onClick={reset} className="p-2 rounded-full hover:bg-muted/50 transition-colors">
              <RotateCcw className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          <div className="flex items-center gap-1.5 bg-muted/40 rounded-full px-3 py-1">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold text-foreground">{tarotTickets}</span>
          </div>
        </div>
      </div>

      {/* Landing Phase */}
      <AnimatePresence mode="wait">
        {phase === "landing" && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center px-4 pt-4">
            <div className="w-full max-w-sm rounded-2xl overflow-hidden border border-accent/20 shadow-gold mb-4">
              <img src={madamZaraImg} alt="Madam Zara" className="w-full object-cover" />
            </div>
            <h2 className="font-display text-2xl font-bold text-gold-gradient mb-2">
              {t("madamZaraTitle").replace(" — ", "\n").split("\n")[0] || "Madam Zara"}
            </h2>
            <p className="text-sm text-muted-foreground text-center leading-relaxed max-w-xs mb-6">
              {t("selectCardReveal")}
            </p>
            <motion.button whileTap={{ scale: 0.96 }} onClick={startSession} disabled={tarotTickets <= 0}
              className={cn(
                "w-full max-w-sm py-3.5 rounded-2xl font-bold text-sm shadow-gold flex items-center justify-center gap-2",
                tarotTickets > 0
                  ? "bg-gradient-to-r from-primary to-yellow-500 text-primary-foreground"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}>
              <Sparkles className="w-4 h-4" />
              {t("startTarotBtn")} ({tarotTickets} {t("ticket")})
            </motion.button>
            {tarotTickets <= 0 && (
              <p className="text-xs text-muted-foreground mt-3 text-center">{t("noTicketsTarot")}</p>
            )}
          </motion.div>
        )}

        {/* Card Selection Phase */}
        {phase === "select" && (
          <motion.div key="select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="px-4 pt-4">
            <div className="text-center mb-3">
              <p className="text-sm font-bold text-primary">
                {t("selectCardsHeart")} — ({selectedCards.length}/{MAX_CARDS})
              </p>
              <p className="text-xs text-muted-foreground mt-1">{t("tapAnyCard")}</p>
            </div>

            <div className="grid grid-cols-5 gap-2 max-h-[58vh] overflow-y-auto pb-3 px-0.5">
              {shuffledDeck.map((card, index) => {
                const order = getSelectionOrder(card.id);
                const isSelected = order > 0;
                const disabled = !isSelected && selectedCards.length >= MAX_CARDS;
                return (
                  <motion.button key={card.id} onClick={() => handleCardSelect(card)} disabled={disabled}
                    whileTap={{ scale: 0.92 }}
                    className={cn(
                      "relative aspect-[2/3] rounded-lg overflow-hidden transition-all duration-200",
                      isSelected ? "ring-2 ring-primary shadow-gold scale-[1.02] brightness-110" : "ring-1 ring-border/40 hover:ring-accent/60",
                      disabled && "opacity-30 pointer-events-none"
                    )}>
                    <img src={cardBackImg} alt={`${t("card")} ${index + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={cn("text-lg font-display font-bold", isSelected ? "text-primary" : "text-primary/70")}>{index + 1}</span>
                    </div>
                    {isSelected && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <span className="text-[10px] font-bold">{order}</span>
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {selectedCards.length === MAX_CARDS && (
                <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                  whileTap={{ scale: 0.96 }} onClick={startReading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-yellow-500 text-primary-foreground font-bold text-sm shadow-gold flex items-center justify-center gap-2 mt-3">
                  <Sparkles className="w-4 h-4" />
                  {t("revealReadTarot")}
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Reading / Chat Phase */}
        {(phase === "reading" || phase === "chat") && (
          <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col px-4 pt-3" style={{ height: "calc(100vh - 140px)" }}>
            <div className="flex items-center justify-center gap-3 pb-3">
              {selectedCards.map((card, i) => (
                <motion.div key={card.id}
                  initial={{ rotateY: 180, scale: 0.5 }} animate={{ rotateY: 0, scale: 1 }}
                  transition={{ delay: i * 0.2, duration: 0.5 }}
                  className="relative bg-card border border-accent/30 rounded-xl overflow-hidden text-center w-24 shadow-gold">
                  <img src={card.imageUrl} alt={card.name} className="w-full aspect-[2/3] object-cover" loading="eager" />
                  <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                    <span className="text-[10px] font-bold">{i + 1}</span>
                  </div>
                  <p className="text-[9px] font-bold text-foreground py-1.5 px-1 leading-tight">
                    {language === "ar" ? card.nameAr : card.name}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 py-2">
              {messages.filter(m => m.role === "assistant").map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-card/80 border border-accent/20 rounded-2xl px-4 py-3 text-sm text-foreground/90">
                  <div className="prose prose-sm prose-invert max-w-none [&_p]:my-1.5 [&_li]:my-0 [&_h2]:text-primary [&_h3]:text-accent [&_strong]:text-foreground">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </motion.div>
              ))}
              {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="bg-card/80 border border-accent/20 rounded-2xl px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-accent animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {phase === "chat" && (
              <div className={cn("flex gap-2 pt-2 pb-2 border-t border-border/30", isRTL && "flex-row-reverse")}>
                <input value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder={t("askMadamZara")}
                  className="flex-1 bg-muted/30 border border-border/50 rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50"
                  disabled={isStreaming} />
                <button onClick={sendMessage} disabled={isStreaming || !input.trim()}
                  className="p-2.5 rounded-xl bg-primary/20 border border-primary/30 text-primary disabled:opacity-40">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
