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

  const ringSize = size === "lg" ? "w-[104px] h-[104px]" : "w-[43px] h-[43px]";
  const innerSize = size === "lg" ? "w-[96px] h-[96px]" : "w-[39px] h-[39px]";
  const cornerSize = size === "lg" ? 6 : 3;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      {/* Outer elegant ring */}
      <div className={cn("absolute rounded-full", ringSize)}
        style={{
          background: "linear-gradient(135deg, hsl(45 100% 65%), hsl(45 100% 45%), hsl(35 100% 40%), hsl(45 100% 55%))",
          padding: size === "lg" ? 3 : 2,
        }}
      >
        <div className={cn("w-full h-full rounded-full")}
          style={{ background: "hsl(var(--background))" }}
        />
      </div>

      {/* Inner gold ring with gap */}
      <div className={cn("absolute rounded-full", innerSize)}
        style={{
          boxShadow: `inset 0 0 0 ${size === "lg" ? "1.5px" : "1px"} hsl(45 100% 55% / 0.6)`,
        }}
      />

      {/* Subtle ambient glow */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className={cn("absolute rounded-full", ringSize)}
        style={{
          boxShadow: size === "lg"
            ? "0 0 12px hsl(45 100% 50% / 0.25), 0 0 24px hsl(45 100% 50% / 0.1)"
            : "0 0 6px hsl(45 100% 50% / 0.2), 0 0 12px hsl(45 100% 50% / 0.08)",
        }}
      />

      {/* Corner ornaments */}
      {[0, 90, 180, 270].map((deg) => (
        <div
          key={deg}
          className="absolute"
          style={{
            width: cornerSize,
            height: cornerSize,
            background: "linear-gradient(135deg, hsl(45 100% 70%), hsl(45 100% 45%))",
            borderRadius: "50%",
            transform: `rotate(${deg}deg) translateY(${size === "lg" ? -52 : -21.5}px)`,
            boxShadow: "0 0 4px hsl(45 100% 50% / 0.5)",
          }}
        />
      ))}

      {/* The actual avatar */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Diamond badge */}
      <div className={cn(
        "absolute z-20 flex items-center justify-center",
        size === "lg" ? "-bottom-1 left-1/2 -translate-x-1/2" : "-bottom-1 -right-1"
      )}>
        <div className={cn(
          "flex items-center justify-center rounded-full border-2 border-background",
          size === "lg" ? "w-6 h-6 text-[10px]" : "w-4 h-4 text-[8px]"
        )}
          style={{
            background: "linear-gradient(135deg, hsl(45 100% 55%), hsl(35 100% 40%))",
          }}
        >
          <span className="font-bold text-primary-foreground">💎</span>
        </div>
      </div>
    </div>
  );
}
