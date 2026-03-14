import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import ScrollReveal from "@/components/ScrollReveal";
import BreathingExercise from "@/components/BreathingExercise";
import GroundingExercise from "@/components/GroundingExercise";
import { Search, Phone, MapPin, ExternalLink } from "lucide-react";

const filters = [
  { emoji: "😰", label: "Anxiety" },
  { emoji: "😴", label: "Sleep" },
  { emoji: "💸", label: "Finance" },
  { emoji: "🏠", label: "Housing" },
  { emoji: "📚", label: "Academic" },
  { emoji: "🧘", label: "Mindfulness" },
];

const articles = [
  { title: "What is anxiety?", time: "2 min read", tag: "Anxiety" },
  { title: "Why sleep matters more than you think", time: "3 min read", tag: "Sleep" },
  { title: "How to talk to a professor when you're struggling", time: "4 min read", tag: "Academic" },
  { title: "Signs your stress has become something more", time: "3 min read", tag: "Wellbeing" },
];

type Overlay = null | "breathing" | "grounding";

export default function Resources() {
  const [search, setSearch] = useState("");
  const [overlay, setOverlay] = useState<Overlay>(null);

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  };

  return (
    <>
      <AnimatePresence>
        {overlay === "breathing" && <BreathingExercise onClose={() => setOverlay(null)} />}
        {overlay === "grounding" && <GroundingExercise onClose={() => setOverlay(null)} />}
      </AnimatePresence>

      <PageWrapper>
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.div variants={fadeUp}>
            <h1 className="text-[28px] font-heading leading-tight mb-4">Resources</h1>
            <div className="relative mb-4">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find support for..."
                className="w-full pl-10 pr-4 py-3 rounded-pill bg-card text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-soft"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
              {filters.map((f) => (
                <button
                  key={f.label}
                  className="flex-shrink-0 px-3 py-1.5 rounded-pill bg-surface-2 text-xs font-body flex items-center gap-1 hover:bg-primary/10 transition-colors"
                >
                  <span>{f.emoji}</span> {f.label}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h3 className="font-heading text-base mb-3">Right Now (Under 5 Minutes)</h3>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <QuickCard emoji="🫁" label="Box Breathing" onClick={() => setOverlay("breathing")} />
              <QuickCard emoji="🧊" label="5-4-3-2-1 Grounding" onClick={() => setOverlay("grounding")} />
              <QuickCard emoji="✍️" label="Dump It Out" onClick={() => {}} />
            </div>
          </motion.div>

          <ScrollReveal>
            <h3 className="font-heading text-base mb-3">Campus Support (Official)</h3>
            <div className="space-y-3 mb-6">
              <ServiceCard
                emoji="🏥"
                title="Student Health Center"
                detail="Mon–Fri 8am–6pm · Room 204, Main Building"
                buttons={[
                  { label: "Get Directions", icon: <MapPin size={12} /> },
                  { label: "Call Now", icon: <Phone size={12} /> },
                ]}
              />
              <ServiceCard
                emoji="🧠"
                title="Counseling Services"
                detail="Free for enrolled students · Book online"
                buttons={[{ label: "Book Appointment", icon: <ExternalLink size={12} /> }]}
              />
              <ServiceCard
                emoji="🆘"
                title="Crisis Line"
                detail="24/7 · Free · Confidential"
                buttons={[{ label: "Call Now", icon: <Phone size={12} /> }]}
                urgent
              />
              <ServiceCard
                emoji="💰"
                title="Financial Aid Emergency Fund"
                detail="Same-day assistance available"
                buttons={[{ label: "Learn More", icon: <ExternalLink size={12} /> }]}
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h3 className="font-heading text-base mb-3">Learn & Understand</h3>
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
              {articles.map((a) => (
                <motion.div
                  key={a.title}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="flex-shrink-0 w-52 card-neu p-4 cursor-pointer"
                >
                  <div className="w-full h-20 rounded-lg bg-gradient-to-br from-secondary/30 to-accent-2/20 mb-3" />
                  <p className="font-body font-medium text-sm leading-snug mb-1">{a.title}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground">{a.time}</span>
                    <span className="px-2 py-0.5 rounded-pill bg-surface-2 text-[10px] font-body">{a.tag}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </motion.div>
      </PageWrapper>
    </>
  );
}

function QuickCard({ emoji, label, onClick }: { emoji: string; label: string; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ y: -3 }}
      onClick={onClick}
      className="card-neu p-3 flex flex-col items-center gap-2 text-center"
    >
      <span className="text-2xl">{emoji}</span>
      <span className="text-[11px] font-body font-medium leading-tight">{label}</span>
    </motion.button>
  );
}

function ServiceCard({
  emoji,
  title,
  detail,
  buttons,
  urgent,
}: {
  emoji: string;
  title: string;
  detail: string;
  buttons: { label: string; icon: React.ReactNode }[];
  urgent?: boolean;
}) {
  return (
    <div className={`card-neu p-4 ${urgent ? "border-l-4 border-warning" : ""}`}>
      <div className="flex gap-3 items-start mb-3">
        <span className="text-2xl">{emoji}</span>
        <div>
          <p className="font-body font-medium text-sm">{title}</p>
          <p className="text-muted-foreground text-xs font-body mt-0.5">{detail}</p>
        </div>
      </div>
      <div className="flex gap-2">
        {buttons.map((b) => (
          <button
            key={b.label}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-pill text-xs font-body font-medium ${
              urgent
                ? "bg-warning text-warning-foreground"
                : "bg-primary/10 text-primary"
            }`}
          >
            {b.icon}
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}
