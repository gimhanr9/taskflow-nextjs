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
import { TaskVelocityChart } from "@/components/dashboard/TaskVelocityChart";
import { StatusDistributionChart } from "@/components/dashboard/StatusDistributionChart";
import { Clock, AlertTriangle, Layers, TrendingUp } from "lucide-react";

interface AnalyticsViewProps {
  stats: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    todoTasks: number;
    completionRate: number;
    totalProjects: number;
  };
  velocityData: Array<{
    date: string;
    completed: number;
    created: number;
  }>;
  statusData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  priorityData: Array<{
    priority: string;
    count: number;
    fill: string;
  }>;
  projects: Array<{
    id: string;
    title: string;
    color: string;
    progress: number;
    totalTasks: number;
    completedTasks: number;
  }>;
}

export function AnalyticsView({
  stats,
  velocityData,
  statusData,
  priorityData,
  projects,
}: AnalyticsViewProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-8">
      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-slate-200/80 bg-white shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>Completion Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.completionRate}%</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {stats.completedTasks} of {stats.totalTasks} total tasks completed
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-200/80 bg-white shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>In Progress Tasks</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.inProgressTasks}</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Active tasks currently being built</p>
        </div>

        <div className="p-5 rounded-xl border border-slate-200/80 bg-white shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>Pending To Do</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.todoTasks}</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Backlogged items ready for work</p>
        </div>

        <div className="p-5 rounded-xl border border-slate-200/80 bg-white shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>Active Initiatives</span>
            <Layers className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.totalProjects}</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Projects under management</p>
        </div>
      </div>

      {/* Row 2: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Velocity */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900 text-sm">Tasks Activity Velocity</h3>
            <p className="text-xs text-slate-500">Daily creation vs completion rate</p>
          </div>
          <div className="mt-4">
            <TaskVelocityChart data={velocityData} />
          </div>
        </div>

        {/* Status Distribution */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900 text-sm">Task Status Distribution</h3>
            <p className="text-xs text-slate-500">Breakdown of workflow stages</p>
          </div>
          <div className="mt-4">
            <StatusDistributionChart data={statusData} />
          </div>
        </div>
      </div>

      {/* Row 3: Priority Breakdown & Project Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Breakdown Chart */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900 text-sm">Tasks by Priority</h3>
            <p className="text-xs text-slate-500">Volume distribution across priority tiers</p>
          </div>
          <div className="mt-4 h-64 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="priority"
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
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" name="Tasks" radius={[4, 4, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Loading priority chart...
              </div>
            )}
          </div>
        </div>

        {/* Project Completion Progress */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900 text-sm">Project Completion Velocities</h3>
            <p className="text-xs text-slate-500">Progress rate across all active projects</p>
          </div>

          <div className="mt-4 space-y-4 max-h-64 overflow-y-auto pr-1">
            {projects.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No projects to display progress.
              </div>
            ) : (
              projects.map((p) => (
                <div key={p.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900 flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: p.color }}
                      />
                      {p.title}
                    </span>
                    <span className="text-slate-500 font-medium">
                      {p.completedTasks}/{p.totalTasks} ({p.progress}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${p.progress}%`,
                        backgroundColor: p.color,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
