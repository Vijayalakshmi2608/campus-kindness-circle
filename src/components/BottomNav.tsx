import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, MessageCircle, Leaf, BarChart3 } from "lucide-react";

const tabs = [
  { path: "/home", icon: Home, label: "Home", emoji: "🏠" },
  { path: "/connect", icon: MessageCircle, label: "Connect", emoji: "💬" },
  { path: "/resources", icon: Leaf, label: "Resources", emoji: "🌿" },
  { path: "/journey", icon: BarChart3, label: "Journey", emoji: "📊" },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeIdx = tabs.findIndex((t) => location.pathname.startsWith(t.path));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-t border-border">
      <div className="max-app flex items-center justify-around h-16 px-2 relative">
        {activeIdx >= 0 && (
          <motion.div
            className="absolute top-0 h-[3px] rounded-full bg-primary"
            style={{ width: `${100 / tabs.length}%` }}
            animate={{ left: `${(activeIdx * 100) / tabs.length}%` }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
        {tabs.map((tab) => {
          const active = location.pathname.startsWith(tab.path);
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-0.5 flex-1 py-1 relative"
            >
              <motion.div
                animate={{ scale: active ? 1.15 : 1, y: active ? -2 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <tab.icon
                  size={22}
                  className={active ? "text-primary" : "text-muted-foreground"}
                  strokeWidth={active ? 2.5 : 1.8}
                />
              </motion.div>
              <span
                className={`text-[10px] font-body font-medium ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom,0px)]" />
    </nav>
  );
}
