import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { MoodEntry } from "@/lib/data";

interface Props {
  data: (MoodEntry | null)[];
  labels: string[];
}

export default function MoodChart({ data, labels }: Props) {
  const chartData = data.map((entry, i) => ({
    day: labels[i],
    score: entry?.score ?? null,
  }));

  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(210, 36%, 37%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(210, 36%, 37%)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fontFamily: "JetBrains Mono", fill: "hsl(220, 9%, 46%)" }}
          />
          <YAxis
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 9, fontFamily: "JetBrains Mono", fill: "hsl(220, 9%, 46%)" }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="hsl(210, 36%, 37%)"
            strokeWidth={2.5}
            fill="url(#moodGradient)"
            connectNulls
            dot={{ r: 4, fill: "hsl(210, 36%, 37%)", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
