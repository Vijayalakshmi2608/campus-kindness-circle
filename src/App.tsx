import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { loadUserData, saveUserData, UserData } from "@/lib/data";
import Onboarding from "@/components/Onboarding";
import BottomNav from "@/components/BottomNav";
import AnimatedRoute from "@/components/AnimatedRoute";
import ParallaxBlobs from "@/components/ParallaxBlobs";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/pages/Home";
import Connect from "@/pages/Connect";
import Resources from "@/pages/Resources";
import Journey from "@/pages/Journey";

function AppRoutes({ userData, setUserData }: { userData: UserData; setUserData: (d: UserData) => void }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <AnimatedRoute key={location.pathname}>
        <Routes location={location}>
          <Route path="/home" element={<Home userData={userData} setUserData={setUserData} />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/journey" element={<Journey userData={userData} />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AnimatedRoute>
    </AnimatePresence>
  );
}

const App = () => {
  const [userData, setUserData] = useState<UserData>(loadUserData);
  const [ready, setReady] = useState(userData.onboarded);

  useEffect(() => {
    saveUserData(userData);
  }, [userData]);

  const handleOnboardingComplete = (name: string) => {
    const updated = { ...userData, name, onboarded: true };
    setUserData(updated);
    setReady(true);
  };

  if (!ready) {
    return (
      <>
        <Onboarding onComplete={handleOnboardingComplete} />
        <Toaster />
      </>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background relative">
        <ParallaxBlobs />
        <div className="relative z-10">
          <AppRoutes userData={userData} setUserData={setUserData} />
        </div>
        <BottomNav />
      </div>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
