import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { loadUserData, saveUserData, UserData } from "@/lib/data";
import Onboarding from "@/components/Onboarding";
import BottomNav from "@/components/BottomNav";
import Home from "@/pages/Home";
import Connect from "@/pages/Connect";
import Resources from "@/pages/Resources";
import Journey from "@/pages/Journey";

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
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/home" element={<Home userData={userData} setUserData={setUserData} />} />
            <Route path="/connect" element={<Connect />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/journey" element={<Journey userData={userData} />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </AnimatePresence>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
};

export default App;
