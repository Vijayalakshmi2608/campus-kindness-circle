import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MOODS } from "@/lib/data";

interface Props {
  onComplete: (name: string) => void;
}

export default function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");

  const screens = [
    {
      title: "You matter. This is your space.",
      body: "CampusCare is a private, anonymous wellbeing companion built for students, by students.",
      visual: (
        <div className="relative w-48 h-48 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-secondary/60 to-accent-2/40 animate-pulse-soft" />
          <div className="absolute inset-6 rounded-full bg-gradient-to-tr from-accent/30 to-secondary/50 animate-pulse-soft" style={{ animationDelay: "0.5s" }} />
          <div className="absolute inset-12 rounded-full bg-card flex items-center justify-center">
            <span className="text-5xl">🌱</span>
          </div>
        </div>
      ),
    },
    {
      title: "Check in daily. It takes 3 seconds.",
      body: "One honest emoji a day builds a picture of how you're really doing — and helps us support you better.",
      visual: (
        <div className="flex justify-center gap-3 mb-8">
          {MOODS.map((m) => (
            <div key={m.score} className="w-12 h-12 rounded-2xl bg-surface-2 flex items-center justify-center text-2xl shadow-soft">
              {m.emoji}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Everything here is private.",
      body: null,
      visual: (
        <div className="space-y-4 mb-8 text-left max-w-xs mx-auto">
          {[
            "Your mood data never leaves your device",
            "Peer chats are fully anonymous",
            "No data is ever sold or shared",
          ].map((point) => (
            <div key={point} className="flex items-start gap-3">
              <span className="text-accent-2 text-lg mt-0.5">✓</span>
              <span className="font-body text-foreground/80">{point}</span>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="text-center max-w-sm w-full"
        >
          {screens[step].visual}
          <h1 className="text-2xl font-heading mb-3">{screens[step].title}</h1>
          {screens[step].body && (
            <p className="text-muted-foreground font-body mb-6 leading-relaxed">{screens[step].body}</p>
          )}

          {step === 2 && (
            <div className="mt-4 mb-6">
              <input
                type="text"
                placeholder="What should we call you?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-3.5 rounded-pill bg-card text-foreground font-body placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 text-center shadow-soft"
              />
            </div>
          )}

          {/* Dots */}
          <div className="flex justify-center gap-2 mb-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  i <= step ? "bg-primary" : "bg-muted-foreground/20"
                }`}
              />
            ))}
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              if (step < 2) setStep(step + 1);
              else if (name.trim()) onComplete(name.trim());
            }}
            disabled={step === 2 && !name.trim()}
            className="w-full py-4 rounded-pill bg-primary text-primary-foreground font-body font-medium text-base disabled:opacity-40 transition-opacity"
          >
            {step < 2 ? "Next" : "I'm ready →"}
          </motion.button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
