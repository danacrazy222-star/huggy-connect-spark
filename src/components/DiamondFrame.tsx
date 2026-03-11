import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DiamondFrameProps {
  children: React.ReactNode;
  size?: "sm" | "lg";
  active?: boolean;
  level?: number;
  className?: string;
}

type FrameTier = "bronze" | "silver" | "gold" | "diamond" | "legend";

function getFrameTier(level: number): FrameTier {
  if (level >= 33) return "legend";
  if (level >= 25) return "diamond";
  if (level >= 17) return "gold";
  if (level >= 9) return "silver";
  return "bronze";
}

const TIER_CONFIG: Record<FrameTier, {
  gradient: string;
  glowColor: string;
  spinDuration: number;
  particles: boolean;
  ornament: string | null;
  counterRing: boolean;
}> = {
  bronze: {
    gradient: "conic-gradient(from 0deg, hsl(25 70% 45%), hsl(30 60% 30%), hsl(20 80% 55%), hsl(25 50% 25%), hsl(30 70% 50%), hsl(20 60% 35%), hsl(25 70% 45%))",
    glowColor: "hsl(25 70% 45%)",
    spinDuration: 10,
    particles: false,
    ornament: null,
    counterRing: false,
  },
  silver: {
    gradient: "conic-gradient(from 0deg, hsl(210 10% 70%), hsl(220 8% 50%), hsl(200 15% 80%), hsl(215 10% 45%), hsl(210 12% 75%), hsl(220 8% 55%), hsl(210 10% 70%))",
    glowColor: "hsl(210 10% 70%)",
    spinDuration: 9,
    particles: false,
    ornament: null,
    counterRing: false,
  },
  gold: {
    gradient: "conic-gradient(from 0deg, hsl(45 100% 60%), hsl(35 100% 38%), hsl(45 100% 70%), hsl(40 80% 30%), hsl(45 100% 55%), hsl(35 100% 38%), hsl(45 100% 60%))",
    glowColor: "hsl(45 100% 50%)",
    spinDuration: 7,
    particles: false,
    ornament: null,
    counterRing: false,
  },
  diamond: {
    gradient: "conic-gradient(from 0deg, hsl(220 100% 70%), hsl(240 80% 55%), hsl(210 100% 80%), hsl(250 70% 45%), hsl(220 100% 65%), hsl(200 90% 75%), hsl(230 80% 50%), hsl(220 100% 70%))",
    glowColor: "hsl(220 100% 65%)",
    spinDuration: 6,
    particles: true,
    ornament: null,
    counterRing: false,
  },
  legend: {
    gradient: "conic-gradient(from 0deg, hsl(220 100% 70%), hsl(240 80% 55%), hsl(210 100% 80%), hsl(250 70% 45%), hsl(220 100% 65%), hsl(200 90% 75%), hsl(230 80% 50%), hsl(220 100% 70%))",
    glowColor: "hsl(220 100% 65%)",
    spinDuration: 8,
    particles: true,
    ornament: "💎",
    counterRing: true,
  },
};

export function DiamondFrame({ children, size = "sm", active = true, level = 1, className }: DiamondFrameProps) {
  if (!active) return <>{children}</>;

  const tier = getFrameTier(level);
  const config = TIER_CONFIG[tier];

  const outerSize = size === "lg" ? "w-[110px] h-[110px]" : "w-[47px] h-[47px]";
  const innerSize = size === "lg" ? "w-[100px] h-[100px]" : "w-[41px] h-[41px]";
  const pad = size === "lg" ? 5 : 3;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      {/* Sparkle particles for diamond+ */}
      {config.particles && (
        <>
          {[0, 60, 120, 180, 240, 300].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const r = size === "lg" ? 62 : 27;
            return (
              <motion.div
                key={deg}
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.6, 1.2, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, delay: deg / 360 * 2, ease: "easeInOut" }}
                className="absolute z-20"
                style={{
                  width: size === "lg" ? 6 : 3,
                  height: size === "lg" ? 6 : 3,
                  borderRadius: "1px",
                  transform: "rotate(45deg)",
                  left: `calc(50% + ${Math.cos(rad) * r}px - ${size === "lg" ? 3 : 1.5}px)`,
                  top: `calc(50% + ${Math.sin(rad) * r}px - ${size === "lg" ? 3 : 1.5}px)`,
                  background: "hsl(210 100% 85%)",
                  boxShadow: "0 0 4px hsl(220 100% 70%), 0 0 8px hsl(220 100% 60% / 0.5)",
                }}
              />
            );
          })}
        </>
      )}

      {/* Crown ornament for Legend (large only) */}
      {config.ornament && size === "lg" && (
        <motion.div
          animate={{ y: [-1, 1, -1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute z-30 flex items-center justify-center"
          style={{ top: -8 }}
        >
          <span className="text-sm drop-shadow-[0_0_6px_hsl(220_100%_70%)]">{config.ornament}</span>
        </motion.div>
      )}

      {/* Animated rotating gradient ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: config.spinDuration, repeat: Infinity, ease: "linear" }}
        className={cn("absolute rounded-full", outerSize)}
        style={{ background: config.gradient, padding: pad }}
      />

      {/* Counter-rotating ring for Legend */}
      {config.counterRing && (
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className={cn("absolute rounded-full",
            size === "lg" ? "w-[114px] h-[114px]" : "w-[49px] h-[49px]"
          )}
          style={{
            border: size === "lg" ? "1.5px solid" : "1px solid",
            borderImage: "linear-gradient(135deg, hsl(220 100% 80% / 0.6), transparent, hsl(240 80% 70% / 0.6), transparent) 1",
            borderRadius: "50%",
            borderImageSlice: 1,
          }}
        />
      )}

      {/* Background fill to create ring effect */}
      <div className={cn("absolute rounded-full", innerSize)} style={{ background: "hsl(var(--background))" }} />

      {/* Pulsing glow */}
      <motion.div
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: tier === "legend" ? 2.5 : 3, repeat: Infinity, ease: "easeInOut" }}
        className={cn("absolute rounded-full", outerSize)}
        style={{
          boxShadow: size === "lg"
            ? `0 0 16px ${config.glowColor}40, 0 0 32px ${config.glowColor}20, 0 0 48px ${config.glowColor}10`
            : `0 0 8px ${config.glowColor}30, 0 0 16px ${config.glowColor}15`,
        }}
      />

      {/* The avatar */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
