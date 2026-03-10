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

  const outerSize = size === "lg" ? "w-[106px] h-[106px]" : "w-[45px] h-[45px]";

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      {/* Animated rotating gradient ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className={cn("absolute rounded-full", outerSize)}
        style={{
          background: "conic-gradient(from 0deg, hsl(45 100% 60%), hsl(35 100% 38%), hsl(45 100% 70%), hsl(40 80% 30%), hsl(45 100% 55%), hsl(35 100% 38%), hsl(45 100% 60%))",
        }}
      />

      {/* Background fill to create ring effect */}
      <div
        className={cn("absolute rounded-full", size === "lg" ? "w-[100px] h-[100px]" : "w-[41px] h-[41px]")}
        style={{ background: "hsl(var(--background))" }}
      />

      {/* Subtle pulsing glow */}
      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className={cn("absolute rounded-full", outerSize)}
        style={{
          boxShadow: size === "lg"
            ? "0 0 14px hsl(45 100% 50% / 0.3), 0 0 28px hsl(45 100% 50% / 0.1)"
            : "0 0 8px hsl(45 100% 50% / 0.25), 0 0 16px hsl(45 100% 50% / 0.08)",
        }}
      />

      {/* The avatar */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
