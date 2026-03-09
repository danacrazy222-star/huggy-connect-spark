import { useState, useRef, useEffect } from "react";
import { TopBar } from "@/components/TopBar";
import { useTranslation } from "@/hooks/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Lock, Send, RotateCcw } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { cn } from "@/lib/utils";
import { fullTarotDeck, type TarotCard } from "@/data/tarotDeck";
import tarotReaderImg from "@/assets/tarot-reader.png";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tarot-reading`;
const MAX_CARDS = 3;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function Tarot() {
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
  const [phase, setPhase] = useState<"select" | "reading" | "chat">("select");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [shuffledDeck, setShuffledDeck] = useState<TarotCard[]>([]);
  const { tarotTickets, addTarotTicket } = useGameStore();
  const { t, isRTL, language } = useTranslation();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setShuffledDeck([...fullTarotDeck].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCardSelect = (card: TarotCard) => {
    if (selectedCards.find((c) => c.id === card.id)) {
      setSelectedCards((prev) => prev.filter((c) => c.id !== card.id));
      return;
    }
    if (selectedCards.length >= MAX_CARDS) return;
    setSelectedCards((prev) => [...prev, card]);
  };

  const startReading = async () => {
    if (selectedCards.length === 0 || tarotTickets <= 0) return;
    addTarotTicket(-1);
    setPhase("reading");

    const cardNames = selectedCards.map((c) => `${c.name} (${c.suit})`).join(", ");
    const userMsg: ChatMessage = {
      role: "user",
      content: language === "ar"
        ? `اخترت هذه البطاقات: ${selectedCards.map(c => c.nameAr).join("، ")}. أعطني قراءة.`
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
        body: JSON.stringify({
          messages: allMessages,
          selectedCards,
          language,
        }),
      });

      if (!resp.ok) {
        if (resp.status === 429) toast({ title: "Rate limited", description: "Please try again later", variant: "destructive" });
        else if (resp.status === 402) toast({ title: "Credits required", description: "Please add credits", variant: "destructive" });
        else toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
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
      toast({ title: "Error", description: "Connection failed", variant: "destructive" });
    }
    setIsStreaming(false);
  };

  const reset = () => {
    setSelectedCards([]);
    setMessages([]);
    setPhase("select");
    setShuffledDeck([...fullTarotDeck].sort(() => Math.random() - 0.5));
  };

  const noTickets = tarotTickets <= 0;

  return (
    <div className="min-h-screen bg-premium-gradient stars-bg pb-20" dir={isRTL ? "rtl" : "ltr"}>
      <TopBar title={t("cards")} />

      <div className="px-4 space-y-4">
        {/* Luna Header */}
        <div className="flex flex-col items-center gap-2 pt-2">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-accent shadow-gold">
            <img src={tarotReaderImg} alt="Luna" className="w-full h-full object-cover" />
          </div>
          <div className="text-center">
            <h2 className="font-display text-lg font-bold text-gold-gradient">لونا - Luna</h2>
            <p className="text-xs text-muted-foreground">
              {language === "ar" ? "قارئة التاروت الروحانية" : "Mystical Tarot Reader"}
            </p>
          </div>
          <div className={cn("inline-flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1")}>
            <Sparkles className="w-3 h-3 text-accent" />
            <span className="text-xs text-foreground">{tarotTickets} {t("ticketsRemaining")}</span>
          </div>
        </div>

        {/* Card Selection Phase */}
        {phase === "select" && (
          <>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {language === "ar"
                  ? `اختر ${MAX_CARDS} بطاقات من المجموعة (${selectedCards.length}/${MAX_CARDS})`
                  : `Select ${MAX_CARDS} cards from the spread (${selectedCards.length}/${MAX_CARDS})`}
              </p>
            </div>

            {noTickets ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <Lock className="w-10 h-10 text-muted-foreground" />
                <p className="text-muted-foreground text-center text-sm">{t("noTarotTickets")} {t("spinOrPurchase")}</p>
              </div>
            ) : (
              <>
                {/* Card Grid - face down */}
                <div className="grid grid-cols-6 gap-1.5 max-h-[45vh] overflow-y-auto px-1 py-2">
                  {shuffledDeck.map((card) => {
                    const isSelected = selectedCards.find((c) => c.id === card.id);
                    const disabled = !isSelected && selectedCards.length >= MAX_CARDS;
                    return (
                      <motion.button
                        key={card.id}
                        onClick={() => handleCardSelect(card)}
                        disabled={disabled}
                        whileTap={{ scale: 0.9 }}
                        className={cn(
                          "aspect-[2/3] rounded-lg border transition-all relative overflow-hidden",
                          isSelected
                            ? "border-primary shadow-gold bg-gradient-to-b from-accent/40 to-primary/20 ring-2 ring-primary/50"
                            : "border-border/50 bg-gradient-to-b from-accent/10 to-secondary/20 hover:border-accent/50",
                          disabled && "opacity-30"
                        )}
                      >
                        {isSelected ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-0.5">
                            <span className="text-lg">{card.emoji}</span>
                            <span className="text-[7px] font-bold text-foreground leading-tight text-center mt-0.5">
                              {language === "ar" ? card.nameAr : card.name.split(" ").slice(-2).join(" ")}
                            </span>
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-5 h-5 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
                              <Sparkles className="w-2.5 h-2.5 text-accent" />
                            </div>
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Selected Cards Display */}
                {selectedCards.length > 0 && (
                  <div className="flex items-center justify-center gap-3">
                    {selectedCards.map((card) => (
                      <motion.div
                        key={card.id}
                        initial={{ scale: 0, rotateY: 180 }}
                        animate={{ scale: 1, rotateY: 0 }}
                        className="bg-card border border-accent/30 rounded-xl p-2 text-center w-20"
                      >
                        <span className="text-2xl">{card.emoji}</span>
                        <p className="text-[9px] font-bold text-foreground mt-1">
                          {language === "ar" ? card.nameAr : card.name}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Start Reading Button */}
                {selectedCards.length === MAX_CARDS && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={startReading}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-sm shadow-gold"
                  >
                    {language === "ar" ? "✨ ابدأ القراءة" : "✨ Start Reading"}
                  </motion.button>
                )}
              </>
            )}
          </>
        )}

        {/* Chat / Reading Phase */}
        {(phase === "reading" || phase === "chat") && (
          <div className="flex flex-col h-[60vh]">
            {/* Selected Cards Bar */}
            <div className="flex items-center justify-center gap-2 pb-2 border-b border-border/30">
              {selectedCards.map((card) => (
                <div key={card.id} className="flex items-center gap-1 bg-muted/50 rounded-full px-2 py-0.5">
                  <span className="text-sm">{card.emoji}</span>
                  <span className="text-[10px] text-foreground">{language === "ar" ? card.nameAr : card.name}</span>
                </div>
              ))}
              <button onClick={reset} className="p-1 rounded-full hover:bg-muted/50 transition-colors">
                <RotateCcw className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 py-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-2",
                    msg.role === "user" ? (isRTL ? "flex-row-reverse" : "flex-row-reverse") : (isRTL ? "flex-row-reverse" : ""),
                  )}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-accent/50 shrink-0">
                      <img src={tarotReaderImg} alt="Luna" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-3 py-2 text-sm",
                      msg.role === "user"
                        ? "bg-primary/20 border border-primary/30 text-foreground"
                        : "bg-card/80 border border-accent/20 text-foreground/90"
                    )}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none [&_p]:my-1 [&_li]:my-0">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
              {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-accent/50 shrink-0">
                    <img src={tarotReaderImg} alt="Luna" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-card/80 border border-accent/20 rounded-2xl px-3 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-accent animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            {phase === "chat" && (
              <div className={cn("flex gap-2 pt-2 border-t border-border/30", isRTL && "flex-row-reverse")}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder={language === "ar" ? "اسأل لونا..." : "Ask Luna..."}
                  className="flex-1 bg-muted/30 border border-border/50 rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50"
                  disabled={isStreaming}
                />
                <button
                  onClick={sendMessage}
                  disabled={isStreaming || !input.trim()}
                  className="p-2 rounded-xl bg-primary/20 border border-primary/30 text-primary disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
