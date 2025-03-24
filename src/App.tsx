
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Vehicles from "./pages/Vehicles";
import History from "./pages/History";
import Notifications from "./pages/Notifications";
import Costs from "./pages/Costs";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Devices from "./pages/Devices";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<>
                <Navbar />
                <Outlet />
              </>}>
                <Route path="/" element={<Index />} />
                <Route path="/vehicles" element={<Vehicles />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/history" element={<History />} />
                <Route path="/costs" element={<Costs />} />
                <Route path="/devices" element={<Devices />} />
              </Route>
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
