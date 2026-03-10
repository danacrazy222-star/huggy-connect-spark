import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DiamondFrameProps {
  children: React.ReactNode;
  size?: "sm" | "lg";
  active?: boolean;
  className?: string;
}

export function DiamondFrame({ children, size = "sm", active = true, className }: DiamondFrameProps) {
  if (!active) return <>{children}</>;

  const sizeClasses = size === "lg" ? "p-[3px]" : "p-[2px]";
  const glowSize = size === "lg" ? "shadow-[0_0_16px_rgba(255,215,0,0.5),0_0_32px_rgba(147,51,234,0.3)]" : "shadow-[0_0_10px_rgba(255,215,0,0.4),0_0_20px_rgba(147,51,234,0.25)]";

  return (
    <div className={cn("relative", className)}>
      {/* Animated rotating gradient border */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className={cn(
          "absolute inset-0 rounded-full",
          glowSize,
        )}
        style={{
          background: "conic-gradient(from 0deg, hsl(45 100% 50%), hsl(270 80% 55%), hsl(45 100% 70%), hsl(320 80% 50%), hsl(45 100% 50%))",
        }}
      />
      {/* Inner container */}
      <div className={cn("relative rounded-full", sizeClasses)}
        style={{
          background: "conic-gradient(from 0deg, hsl(45 100% 50%), hsl(270 80% 55%), hsl(45 100% 70%), hsl(320 80% 50%), hsl(45 100% 50%))",
        }}>
        <div className="rounded-full overflow-hidden bg-background">
          {children}
        </div>
      </div>
      {/* Diamond badge */}
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className={cn(
          "absolute -top-1 -right-1 z-10 text-xs",
          size === "lg" ? "text-base -top-1.5 -right-1.5" : ""
        )}
      >
        💎
      </motion.div>
    </div>
  );
}
