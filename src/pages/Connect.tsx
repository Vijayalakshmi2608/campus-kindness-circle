import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import PageWrapper from "@/components/PageWrapper";
import { CAMPUS_STATS } from "@/lib/data";
import { Send, Shield } from "lucide-react";

type ConnectState = "idle" | "matching" | "chatting";

const matchingTexts = [
  "Finding someone who gets it...",
  "Almost there...",
  "Match found! ✓",
];

export default function Connect() {
  const [state, setState] = useState<ConnectState>("idle");
  const [matchStep, setMatchStep] = useState(0);
  const [messages, setMessages] = useState<{ text: string; fromMe: boolean }[]>([
    { text: "Hey, I'm here. Take your time — what's on your mind?", fromMe: false },
  ]);
  const [input, setInput] = useState("");

  const startMatching = () => {
    setState("matching");
    setMatchStep(0);
    setTimeout(() => setMatchStep(1), 2000);
    setTimeout(() => {
      setMatchStep(2);
      setTimeout(() => {
        setState("chatting");
        toast.success("Connected with Jamie 🎓", {
          description: "Your conversation is fully anonymous and encrypted.",
        });
      }, 800);
    }, 3500);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { text: input.trim(), fromMe: true }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "That sounds really tough. I hear you — you don't have to go through this alone.",
          fromMe: false,
        },
      ]);
    }, 2000);
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };

  return (
    <PageWrapper>
      <AnimatePresence mode="wait">
        {state === "chatting" ? (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col"
            style={{ minHeight: "calc(100vh - 160px)" }}
          >
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
              <div className="w-9 h-9 rounded-full bg-accent-2/20 flex items-center justify-center font-body font-medium text-sm text-accent-2">
                J
              </div>
              <div>
                <p className="font-body font-medium text-sm">Jamie (Peer Listener) 🎓</p>
                <div className="flex items-center gap-1">
                  <Shield size={10} className="text-accent-2" />
                  <span className="text-[10px] text-muted-foreground font-body">Anonymous & encrypted</span>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto mb-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm font-body shadow-soft ${
                      msg.fromMe
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-card text-foreground rounded-bl-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 rounded-pill bg-card text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-soft"
              />
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={sendMessage}
                className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
              >
                <Send size={18} />
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="main" variants={stagger} initial="hidden" animate="show">
            <motion.div variants={fadeUp}>
              <h1 className="text-[28px] font-heading leading-tight">You're not alone.</h1>
              <p className="text-muted-foreground font-body text-sm mt-1 mb-6">
                Connect anonymously with a trained student listener
              </p>
              <div className="flex items-center gap-2 mb-5">
                <span className="w-2 h-2 rounded-full bg-accent-2 animate-pulse" />
                <span className="text-xs font-mono text-muted-foreground">
                  {CAMPUS_STATS.listenersOnline} listeners online now
                </span>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="card-neu p-5 mb-6 border-l-4 border-accent-2">
              <AnimatePresence mode="wait">
                {state === "idle" ? (
                  <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h2 className="font-heading text-lg mb-1">Talk to a Peer Listener</h2>
                    <p className="text-muted-foreground text-sm font-body mb-3">
                      Anonymous. Judgment-free. Usually matched in under 2 minutes.
                    </p>
                    <div className="flex gap-2 mb-4">
                      <span className="px-3 py-1 rounded-pill bg-surface-2 text-xs font-body">🎓 Trained students</span>
                      <span className="px-3 py-1 rounded-pill bg-surface-2 text-xs font-body">🔒 Fully anonymous</span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.94 }}
                      whileHover={{ scale: 1.01 }}
                      onClick={startMatching}
                      className="w-full py-3.5 rounded-pill bg-primary text-primary-foreground font-body font-medium"
                    >
                      Connect Now
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="matching"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-6"
                  >
                    <div className="relative w-16 h-16 mx-auto mb-4">
                      <motion.div
                        className="absolute inset-0 rounded-full bg-primary/20"
                        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <div className="absolute inset-2 rounded-full bg-primary/30 animate-pulse-soft" />
                      <div className="absolute inset-4 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground text-lg">💬</span>
                      </div>
                    </div>
                    <p className="font-body text-sm text-foreground">
                      {matchingTexts[matchStep]}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div variants={fadeUp}>
              <h3 className="font-heading text-base mb-3">Other ways to connect</h3>
              <div className="space-y-3">
                <ConnectCard emoji="📚" title="Join a Study Buddy Session" desc="Find someone to study with nearby" />
                <ConnectCard emoji="🎉" title="Campus Events This Week" desc="Social events to fight isolation" />
                <ConnectCard emoji="👥" title="Peer Support Groups" desc="Themed group chats — exam stress, homesickness, etc." />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}

function ConnectCard({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      className="card-neu p-4 flex gap-3 items-start ripple-container cursor-pointer"
    >
      <span className="text-2xl">{emoji}</span>
      <div>
        <p className="font-body font-medium text-sm">{title}</p>
        <p className="text-muted-foreground text-xs font-body mt-0.5">{desc}</p>
      </div>
    </motion.div>
  );
}
