import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const PHASES = ["Inhale", "Hold", "Exhale", "Hold"] as const;
const PHASE_DURATION = 4000;

export default function BreathingExercise({ onClose }: { onClose: () => void }) {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [seconds, setSeconds] = useState(4);

  useEffect(() => {
    const phaseTimer = setInterval(() => {
      setPhaseIdx((p) => (p + 1) % 4);
      setSeconds(4);
    }, PHASE_DURATION);
    return () => clearInterval(phaseTimer);
  }, []);

  useEffect(() => {
    const secTimer = setInterval(() => {
      setSeconds((s) => (s > 1 ? s - 1 : 4));
    }, 1000);
    return () => clearInterval(secTimer);
  }, []);

  const isExpand = phaseIdx === 0;
  const isContract = phaseIdx === 2;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-secondary/30 backdrop-blur-sm flex flex-col items-center justify-center"
    >
      <button onClick={onClose} className="absolute top-6 right-6 p-2">
        <X size={24} className="text-foreground/60" />
      </button>

      <motion.div
        animate={{
          scale: isExpand ? 1 : isContract ? 0.6 : phaseIdx === 1 ? 1 : 0.6,
        }}
        transition={{ duration: PHASE_DURATION / 1000, ease: "easeInOut" }}
        className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/40 to-secondary/60 flex items-center justify-center mb-8"
      >
        <div className="w-24 h-24 rounded-full bg-card/80 flex items-center justify-center">
          <span className="font-heading text-3xl text-primary">{seconds}</span>
        </div>
      </motion.div>

      <p className="font-heading text-xl text-foreground mb-2">{PHASES[phaseIdx]}</p>
      <p className="font-body text-sm text-muted-foreground">
        Inhale 4s · Hold 4s · Exhale 4s · Hold 4s
      </p>
    </motion.div>
  );
}
