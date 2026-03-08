export type MoodScore = 1 | 2 | 3 | 4 | 5;

export interface MoodEntry {
  date: string; // YYYY-MM-DD
  score: MoodScore;
  note?: string;
}

export interface UserData {
  name: string;
  onboarded: boolean;
  moodHistory: MoodEntry[];
  badges: string[];
  streak: number;
}

export const MOODS = [
  { score: 5 as MoodScore, emoji: "😊", label: "Great" },
  { score: 4 as MoodScore, emoji: "🙂", label: "Good" },
  { score: 3 as MoodScore, emoji: "😐", label: "Okay" },
  { score: 2 as MoodScore, emoji: "😔", label: "Low" },
  { score: 1 as MoodScore, emoji: "😞", label: "Struggling" },
];

export const ALL_BADGES = [
  { id: "first-checkin", emoji: "🌱", label: "First Check-in" },
  { id: "3-day-streak", emoji: "🔥", label: "3-Day Streak" },
  { id: "first-connection", emoji: "💬", label: "First Connection" },
  { id: "breathing", emoji: "🧘", label: "Completed Breathing" },
  { id: "7-day-streak", emoji: "🌟", label: "7-Day Streak" },
  { id: "peer-supporter", emoji: "🤝", label: "Peer Supporter" },
];

export const CAMPUS_STATS = {
  totalCheckins: 614,
  moodDistribution: [
    { label: "Great", percent: 28, color: "hsl(153, 25%, 61%)" },
    { label: "Good", percent: 33, color: "hsl(210, 36%, 37%)" },
    { label: "Okay", percent: 21, color: "hsl(202, 50%, 73%)" },
    { label: "Low", percent: 12, color: "hsl(29, 88%, 67%)" },
    { label: "Struggling", percent: 6, color: "hsl(14, 67%, 63%)" },
  ],
  listenersOnline: 12,
  activeChats: 47,
};

const STORAGE_KEY = "campuscare_data";

function getDateStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
}

const SEED_DATA: UserData = {
  name: "Alex",
  onboarded: true,
  moodHistory: [
    { date: getDateStr(6), score: 3 },
    { date: getDateStr(5), score: 4 },
    { date: getDateStr(4), score: 2 },
    { date: getDateStr(3), score: 4 },
    { date: getDateStr(2), score: 3 },
    { date: getDateStr(1), score: 5 },
  ],
  badges: ["first-checkin", "3-day-streak", "breathing"],
  streak: 5,
};

export function loadUserData(): UserData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // Seed demo data
  saveUserData(SEED_DATA);
  return SEED_DATA;
}

export function saveUserData(data: UserData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getTodayStr(): string {
  return new Date().toISOString().split("T")[0];
}

export function getTodayMood(data: UserData): MoodEntry | undefined {
  const today = getTodayStr();
  return data.moodHistory.find((e) => e.date === today);
}

export function getLast7Days(data: UserData): (MoodEntry | null)[] {
  const result: (MoodEntry | null)[] = [];
  for (let i = 6; i >= 0; i--) {
    const dateStr = getDateStr(i);
    const entry = data.moodHistory.find((e) => e.date === dateStr);
    result.push(entry || null);
  }
  return result;
}

export function getDayLabels(): string[] {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const result: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result.push(days[d.getDay()]);
  }
  return result;
}

export function recordMood(data: UserData, score: MoodScore, note?: string): UserData {
  const today = getTodayStr();
  const existing = data.moodHistory.findIndex((e) => e.date === today);
  const newEntry: MoodEntry = { date: today, score, note };

  const newHistory = [...data.moodHistory];
  if (existing >= 0) {
    newHistory[existing] = newEntry;
  } else {
    newHistory.push(newEntry);
  }

  // Calculate streak
  let streak = 1;
  for (let i = 1; i <= 30; i++) {
    const dateStr = getDateStr(i);
    if (newHistory.find((e) => e.date === dateStr)) {
      streak++;
    } else break;
  }

  // Award badges
  const badges = [...data.badges];
  if (!badges.includes("first-checkin")) badges.push("first-checkin");
  if (streak >= 3 && !badges.includes("3-day-streak")) badges.push("3-day-streak");
  if (streak >= 7 && !badges.includes("7-day-streak")) badges.push("7-day-streak");

  const updated: UserData = {
    ...data,
    moodHistory: newHistory,
    badges,
    streak,
  };
  saveUserData(updated);
  return updated;
}

export function resetForOnboarding() {
  localStorage.removeItem(STORAGE_KEY);
}
