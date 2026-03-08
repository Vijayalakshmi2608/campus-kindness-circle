import { useState } from "react";
import { motion } from "framer-motion";
import { X, ChevronRight } from "lucide-react";

const STEPS = [
  { count: 5, sense: "see", prompt: "Name 5 things you can see right now..." },
  { count: 4, sense: "touch", prompt: "Name 4 things you can touch..." },
  { count: 3, sense: "hear", prompt: "Name 3 things you can hear..." },
  { count: 2, sense: "smell", prompt: "Name 2 things you can smell..." },
  { count: 1, sense: "taste", prompt: "Name 1 thing you can taste..." },
];

export default function GroundingExercise({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const done = step >= STEPS.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-accent-2/10 backdrop-blur-sm flex flex-col items-center justify-center px-8"
    >
      <button onClick={onClose} className="absolute top-6 right-6 p-2">
        <X size={24} className="text-foreground/60" />
      </button>

      {done ? (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <span className="text-5xl mb-4 block">✨</span>
          <h2 className="font-heading text-2xl mb-2">You're grounded.</h2>
          <p className="font-body text-sm text-muted-foreground mb-6">Take a deep breath. You're here, you're safe.</p>
          <motion.button whileTap={{ scale: 0.97 }} onClick={onClose} className="px-8 py-3 rounded-pill bg-primary text-primary-foreground font-body font-medium">
            Done
          </motion.button>
        </motion.div>
      ) : (
        <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="text-center">
          <div className="w-20 h-20 rounded-full bg-card flex items-center justify-center text-4xl mx-auto mb-6 shadow-soft">
            {STEPS[step].count}
          </div>
          <p className="font-heading text-xl mb-2">{STEPS[step].prompt}</p>
          <p className="font-body text-sm text-muted-foreground mb-8">Take your time. There's no rush.</p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setStep(step + 1)}
            className="flex items-center gap-2 mx-auto px-6 py-3 rounded-pill bg-primary text-primary-foreground font-body font-medium"
          >
            Next <ChevronRight size={16} />
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
