import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import MoodChart from "@/components/MoodChart";
import { UserData, ALL_BADGES, getLast7Days, getDayLabels, MOODS } from "@/lib/data";
import { Lock } from "lucide-react";

interface Props {
  userData: UserData;
}

export default function Journey({ userData }: Props) {
  const last7 = getLast7Days(userData);
  const dayLabels = getDayLabels();

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };

  // Generate insights
  const insights: string[] = [];
  const bestDays = last7
    .map((e, i) => (e ? { score: e.score, day: dayLabels[i] } : null))
    .filter(Boolean)
    .sort((a, b) => b!.score - a!.score)
    .slice(0, 2);
  if (bestDays.length >= 2) {
    insights.push(`Your best days this week were ${bestDays[0]!.day} and ${bestDays[1]!.day}`);
  }
  if (userData.streak >= 3) {
    insights.push(`You've checked in ${userData.streak} days in a row — that's real commitment`);
  }
  const struggled = last7.find((e) => e && e.score <= 2);
  if (struggled) {
    insights.push("When you said you were struggling, you reached out. That matters.");
  }

  return (
    <PageWrapper>
      <motion.div variants={stagger} initial="hidden" animate="show">
        <motion.div variants={fadeUp}>
          <h1 className="text-[28px] font-heading leading-tight mb-4">My Journey</h1>
        </motion.div>

        {/* Summary card */}
        <motion.div variants={fadeUp} className="card-neu p-5 mb-6">
          <p className="font-body text-sm text-muted-foreground mb-3">Your wellbeing over time</p>

          {/* Emoji streak */}
          <div className="flex justify-between mb-3">
            {last7.map((entry, i) => {
              const mood = entry ? MOODS.find((m) => m.score === entry.score) : null;
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-2xl bg-surface-2 flex items-center justify-center text-xl">
                    {mood ? mood.emoji : "○"}
                  </div>
                  <span className="text-[9px] font-mono text-muted-foreground">{dayLabels[i]}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">🔥</span>
            <span className="font-body text-sm font-medium">{userData.streak} day streak</span>
          </div>
          <p className="text-xs text-muted-foreground font-body mt-1">
            Checking in daily is an act of self-care.
          </p>
        </motion.div>

        {/* Mood chart */}
        <motion.div variants={fadeUp} className="card-neu p-5 mb-6">
          <p className="font-body text-sm text-muted-foreground mb-3">Mood over 7 days</p>
          <MoodChart data={last7} labels={dayLabels} />
        </motion.div>

        {/* Insights */}
        {insights.length > 0 && (
          <motion.div variants={fadeUp} className="mb-6">
            <h3 className="font-heading text-base mb-3">Insights</h3>
            <div className="space-y-2">
              {insights.map((text, i) => (
                <div key={i} className="card-neu p-4">
                  <p className="font-body text-sm">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Badges */}
        <motion.div variants={fadeUp} className="mb-6">
          <h3 className="font-heading text-base mb-3">Your Milestones</h3>
          <div className="grid grid-cols-4 gap-3">
            {ALL_BADGES.map((badge) => {
              const earned = userData.badges.includes(badge.id);
              return (
                <motion.div
                  key={badge.id}
                  initial={earned ? { scale: 0 } : {}}
                  animate={earned ? { scale: [0, 1.2, 1] } : {}}
                  transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${
                      earned ? "bg-accent/10" : "bg-muted/60 grayscale opacity-40"
                    }`}
                  >
                    {earned ? badge.emoji : <Lock size={16} className="text-muted-foreground" />}
                  </div>
                  <span className="text-[9px] font-body text-center text-muted-foreground leading-tight">
                    {badge.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Privacy note */}
        <motion.div variants={fadeUp} className="text-center mb-4">
          <p className="text-[11px] text-muted-foreground font-body">
            🔒 Your personal mood data is stored only on this device. Only anonymous, aggregated data is shared with your campus.
          </p>
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
}
