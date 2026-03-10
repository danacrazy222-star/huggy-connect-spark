import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { WelcomePopup } from "@/components/WelcomePopup";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Chat from "./pages/Chat";
import VIP from "./pages/VIP";
import Tarot from "./pages/Tarot";
import Games from "./pages/Games";
import Draw from "./pages/Draw";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import PrivateChat from "./pages/PrivateChat";
import Messages from "./pages/Messages";
import PromotionRules from "./pages/PromotionRules";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="mx-auto max-w-md min-h-screen relative">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/vip" element={<VIP />} />
              <Route path="/tarot" element={<Tarot />} />
              <Route path="/games" element={<Games />} />
              <Route path="/draw" element={<Draw />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/promotion-rules" element={<PromotionRules />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
            <WelcomePopup />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
