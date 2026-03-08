import { SpinWheel } from "@/components/SpinWheel";
import { TopBar } from "@/components/TopBar";

const Index = () => {
  return (
    <div className="min-h-screen bg-premium-gradient stars-bg pb-20">
      <TopBar />
      
      {/* Header Banner */}
      <div className="text-center px-4 py-2">
        <h1 className="font-display text-2xl font-bold text-gold-gradient">WINLINE</h1>
        <p className="text-primary font-display text-sm font-semibold">$500 GIFT CARD</p>
        <p className="text-xs text-muted-foreground">PROMOTIONAL DRAW</p>
      </div>

      {/* Spin Wheel */}
      <div className="px-4 py-4">
        <SpinWheel />
      </div>
    </div>
  );
};

export default Index;
