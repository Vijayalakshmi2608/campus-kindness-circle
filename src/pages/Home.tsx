import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import {
  MOODS,
  CAMPUS_STATS,
  MoodScore,
  UserData,
  getTodayMood,
  recordMood,
} from "@/lib/data";

const MOOD_MESSAGES: Record<number, string> = {
  5: "Love to hear it. Keep that energy. 🌟",
  4: "That's a good place to be. You're doing well. ✨",
  3: "That's real. Some days are just okay — and that's enough.",
  2: "Thanks for being honest. You're not alone in this.",
  1: "That took courage to share. Let's find you some support.",
};

interface Props {
  userData: UserData;
  setUserData: (d: UserData) => void;
}

export default function Home({ userData, setUserData }: Props) {
  const todayMood = getTodayMood(userData);
  const [selected, setSelected] = useState<MoodScore | null>(todayMood?.score ?? null);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(!!todayMood);

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const handleSubmit = () => {
    if (!selected) return;
    const updated = recordMood(userData, selected, note || undefined);
    setUserData(updated);
    setSubmitted(true);
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <PageWrapper>
      <motion.div variants={stagger} initial="hidden" animate="show">
        <motion.div variants={fadeUp}>
          <h1 className="text-[28px] font-heading leading-tight">
            {greeting}, {userData.name} ☀️
          </h1>
          <p className="text-muted-foreground font-body text-sm mt-1 mb-6">{dateStr}</p>
        </motion.div>

        <motion.div variants={fadeUp} className="card-neu p-6 mb-6">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-lg font-heading mb-1">How are you actually feeling today?</h2>
                <p className="text-muted-foreground text-sm font-body mb-5">
                  Honest answers only. This is just for you.
                </p>

                <div className="flex justify-between gap-2 mb-5">
                  {MOODS.map((m) => (
                    <motion.button
                      key={m.score}
                      whileTap={{ scale: 0.95 }}
                      animate={{
                        scale: selected === m.score ? 1.1 : 1,
                        backgroundColor:
                          selected === m.score
                            ? "hsl(14, 67%, 63%)"
                            : "hsl(30, 14%, 92%)",
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      onClick={() => setSelected(m.score)}
                      className="flex flex-col items-center gap-1 w-14 h-14 rounded-2xl justify-center"
                    >
                      <span className="text-2xl">{m.emoji}</span>
                      <span
                        className={`text-[9px] font-body font-medium ${
                          selected === m.score ? "text-accent-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {m.label}
                      </span>
                    </motion.button>
                  ))}
                </div>

                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Want to add anything? (private)"
                  rows={2}
                  className="w-full px-4 py-3 rounded-lg bg-surface-2 text-foreground text-sm font-body placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 mb-4"
                />

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  disabled={!selected}
                  className="w-full py-3.5 rounded-pill bg-accent text-accent-foreground font-body font-medium disabled:opacity-30 transition-opacity"
                >
                  Check In
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <p className="text-base font-body leading-relaxed mb-4">
                  {MOOD_MESSAGES[selected ?? todayMood?.score ?? 3]}
                </p>
                <div className="font-mono text-xs text-muted-foreground mb-3">
                  {CAMPUS_STATS.totalCheckins} students checked in today
                </div>

                {/* Campus pulse bar */}
                <div className="mb-2">
                  <p className="text-xs font-body text-muted-foreground mb-1.5">Your campus today</p>
                  <div className="flex h-3 rounded-pill overflow-hidden">
                    {CAMPUS_STATS.moodDistribution.map((seg) => (
                      <motion.div
                        key={seg.label}
                        initial={{ width: 0 }}
                        animate={{ width: `${seg.percent}%` }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                        style={{ backgroundColor: seg.color }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-1">
                    {CAMPUS_STATS.moodDistribution.map((seg) => (
                      <span key={seg.label} className="text-[9px] font-mono text-muted-foreground">
                        {seg.percent}%
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Suggestion cards */}
        {submitted && (
          <motion.div variants={fadeUp}>
            <h3 className="font-heading text-base mb-3">Based on your check-in</h3>
            <div className="space-y-3">
              {(selected ?? todayMood?.score ?? 3) <= 2 ? (
                <>
                  <SuggestionCard
                    emoji="💬"
                    title="Talk to a Peer Listener"
                    desc="Anonymous, trained student support — usually matched in under 2 min."
                    color="bg-accent-2/10"
                  />
                  <SuggestionCard
                    emoji="🫁"
                    title="Try Box Breathing"
                    desc="A 2-minute exercise to calm your nervous system."
                    color="bg-secondary/20"
                  />
                </>
              ) : (selected ?? todayMood?.score ?? 3) <= 4 ? (
                <>
                  <SuggestionCard
                    emoji="🙏"
                    title="Gratitude Prompt"
                    desc="Name one thing you're grateful for today."
                    color="bg-accent/10"
                  />
                  <SuggestionCard
                    emoji="🎉"
                    title="Campus Events This Week"
                    desc="Movie night, open mic, and more — fight isolation with connection."
                    color="bg-secondary/20"
                  />
                </>
              ) : (
                <>
                  <SuggestionCard
                    emoji="🤝"
                    title="Pay It Forward"
                    desc="You're doing great — consider becoming a peer listener to help others."
                    color="bg-accent-2/10"
                  />
                </>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </PageWrapper>
  );
}

function SuggestionCard({
  emoji,
  title,
  desc,
  color,
}: {
  emoji: string;
  title: string;
  desc: string;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card-neu p-4 flex gap-3 items-start ${color}`}
    >
      <span className="text-2xl mt-0.5">{emoji}</span>
      <div>
        <p className="font-body font-medium text-sm">{title}</p>
        <p className="text-muted-foreground text-xs font-body mt-0.5">{desc}</p>
      </div>
    </motion.div>
  );
}
