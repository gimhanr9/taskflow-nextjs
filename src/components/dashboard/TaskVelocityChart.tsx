"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface TaskVelocityChartProps {
  data: Array<{
    date: string;
    completed: number;
    created: number;
  }>;
}

export function TaskVelocityChart({ data }: TaskVelocityChartProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-64 w-full flex items-center justify-center bg-slate-50/50 rounded-lg animate-pulse">
        <span className="text-xs text-slate-400">Loading velocity chart...</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-64 w-full flex flex-col items-center justify-center bg-slate-50/50 rounded-lg text-slate-400 text-xs">
        <span>No task completion data recorded yet</span>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={{ stroke: "#e2e8f0" }}
            tick={{ fill: "#64748b", fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#64748b", fontSize: 11 }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="created" name="Created" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={32} />
          <Bar dataKey="completed" name="Completed" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
