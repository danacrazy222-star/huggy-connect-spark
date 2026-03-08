import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Star, Lock } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";

const tarotCards = [
  { name: "The Star", meaning: "Hope, inspiration, and renewed faith", emoji: "⭐" },
  { name: "The Moon", meaning: "Intuition, dreams, and the subconscious", emoji: "🌙" },
  { name: "The Sun", meaning: "Joy, success, and vitality", emoji: "☀️" },
  { name: "The Tower", meaning: "Sudden change and revelation", emoji: "🗼" },
  { name: "The Lovers", meaning: "Harmony, relationships, and choices", emoji: "💕" },
  { name: "Wheel of Fortune", meaning: "Destiny, turning points, and cycles", emoji: "🎡" },
];

export default function Tarot() {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const { tarotTickets, addTarotTicket } = useGameStore();

  const handleCardSelect = (index: number) => {
    if (tarotTickets <= 0 || revealed) return;
    setSelectedCard(index);
    setRevealed(true);
    addTarotTicket(-1);
  };

  const handleReset = () => {
    setSelectedCard(null);
    setRevealed(false);
  };

  return (
    <div className="min-h-screen bg-premium-gradient stars-bg pb-20">
      <TopBar title="Tarot" />

      <div className="px-4 space-y-6">
        {/* Header */}
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-accent mx-auto mb-2" />
          <h2 className="font-display text-xl font-bold text-gold-gradient">AI Tarot Reading</h2>
          <p className="text-sm text-muted-foreground mt-1">Select a card to reveal your destiny</p>
          <div className="inline-flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1 mt-2">
            <Sparkles className="w-3 h-3 text-accent" />
            <span className="text-xs text-foreground">{tarotTickets} tickets remaining</span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-3 gap-3">
          {tarotCards.map((card, i) => (
            <motion.button
              key={i}
              onClick={() => handleCardSelect(i)}
              disabled={tarotTickets <= 0 || revealed}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative aspect-[2/3] rounded-xl border overflow-hidden transition-all ${
                selectedCard === i
                  ? "border-primary shadow-gold"
                  : "border-border hover:border-accent/50"
              } ${tarotTickets <= 0 && !revealed ? "opacity-40" : ""}`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-accent/20 to-secondary/30" />
              
              <AnimatePresence>
                {selectedCard === i && revealed ? (
                  <motion.div
                    initial={{ rotateY: 180, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-2 bg-gradient-to-b from-accent/30 to-card"
                  >
                    <span className="text-2xl mb-1">{card.emoji}</span>
                    <p className="text-[10px] font-bold text-foreground text-center">{card.name}</p>
                    <p className="text-[8px] text-muted-foreground text-center mt-1">{card.meaning}</p>
                  </motion.div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
                      <Star className="w-4 h-4 text-accent" />
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-2">Card {i + 1}</span>
                  </div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>

        {/* Reading result */}
        {revealed && selectedCard !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-accent/30 rounded-2xl p-4 text-center"
          >
            <span className="text-3xl">{tarotCards[selectedCard].emoji}</span>
            <h3 className="font-display text-lg font-bold text-gold-gradient mt-2">{tarotCards[selectedCard].name}</h3>
            <p className="text-sm text-foreground mt-2">{tarotCards[selectedCard].meaning}</p>
            <p className="text-xs text-muted-foreground mt-3">
              The universe speaks through symbols. Trust your intuition and embrace the journey ahead.
            </p>
            <button
              onClick={handleReset}
              className="mt-4 px-6 py-2 rounded-xl bg-accent/20 border border-accent/30 text-sm font-medium text-foreground hover:bg-accent/30 transition-all"
            >
              Read Again
            </button>
          </motion.div>
        )}

        {tarotTickets <= 0 && !revealed && (
          <div className="flex flex-col items-center gap-3 py-8">
            <Lock className="w-10 h-10 text-muted-foreground" />
            <p className="text-muted-foreground text-center text-sm">
              No tarot tickets available. Spin the wheel or purchase a book to earn tickets!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
