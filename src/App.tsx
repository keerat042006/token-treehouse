import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/lib/UserContext";
import { PendingProvider } from "@/lib/PendingActions";
import { EcoBackground } from "@/components/EcoBackground";
import { RouteTransition } from "@/components/RouteTransition";
import { WorldNavProvider } from "@/components/WorldNavContext";
import { WorldNav } from "@/components/WorldNav";
import Dashboard from "./pages/Dashboard";
import SellWaste from "./pages/SellWaste";
import Pickup from "./pages/Pickup";
import Marketplace from "./pages/Marketplace";
import History from "./pages/History";
import Leaderboard from "./pages/Leaderboard";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Arcade from "./pages/Arcade";
import Wallet from "./pages/Wallet";
import EcoMap from "./pages/EcoMap";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <RouteTransition>
      <Routes location={location}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sell" element={<SellWaste />} />
        <Route path="/pickup" element={<Pickup />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/redeem" element={<Marketplace />} />
        <Route path="/history" element={<History />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/map" element={<EcoMap />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/arcade" element={<Arcade />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </RouteTransition>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <PendingProvider>
          <Toaster />
          <Sonner />
          {/* Fixed 3D background — always behind everything */}
          <EcoBackground />
          <BrowserRouter>
            <WorldNavProvider>
              {/* 3D floating world overlay */}
              <WorldNav />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <AnimatedRoutes />
              </div>
            </WorldNavProvider>
          </BrowserRouter>
        </PendingProvider>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
