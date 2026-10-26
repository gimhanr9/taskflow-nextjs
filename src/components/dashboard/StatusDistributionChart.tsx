"use client";

import * as React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface StatusDistributionChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export function StatusDistributionChart({ data }: StatusDistributionChartProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  if (!mounted) {
    return (
      <div className="h-64 w-full flex items-center justify-center bg-slate-50/50 rounded-lg animate-pulse">
        <span className="text-xs text-slate-400">Loading distribution chart...</span>
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="h-64 w-full flex flex-col items-center justify-center bg-slate-50/50 rounded-lg text-slate-400 text-xs">
        <span>No task data to display</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center h-64 w-full gap-4">
      <div className="h-52 w-52 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                fontSize: "12px",
              }}
            />
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-slate-900">{total}</span>
          <span className="text-[11px] font-medium text-slate-400 uppercase">Tasks</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-row sm:flex-col gap-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <div className="text-xs">
              <span className="font-medium text-slate-700">{item.name}</span>
              <span className="ml-1.5 font-bold text-slate-900">
                ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
