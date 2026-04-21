import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/lib/UserContext";
import { EcoBackground } from "@/components/EcoBackground";
import { PageTransitionWrapper } from "@/components/PageTransition";
import Dashboard from "./pages/Dashboard";
import SellWaste from "./pages/SellWaste";
import Pickup from "./pages/Pickup";
import Marketplace from "./pages/Marketplace";
import History from "./pages/History";
import Leaderboard from "./pages/Leaderboard";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Arcade from "./pages/Arcade";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <PageTransitionWrapper>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sell" element={<SellWaste />} />
        <Route path="/pickup" element={<Pickup />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/redeem" element={<Marketplace />} />
        <Route path="/history" element={<History />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/arcade" element={<Arcade />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTransitionWrapper>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <Toaster />
        <Sonner />
        <EcoBackground />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </div>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
