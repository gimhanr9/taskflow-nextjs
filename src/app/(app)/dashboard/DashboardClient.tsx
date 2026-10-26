"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { TaskVelocityChart } from "@/components/dashboard/TaskVelocityChart";
import { StatusDistributionChart } from "@/components/dashboard/StatusDistributionChart";
import { RecentProjectsCard } from "@/components/dashboard/RecentProjectsCard";
import { UpcomingDeadlinesCard } from "@/components/dashboard/UpcomingDeadlinesCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { TaskModal } from "@/components/tasks/TaskModal";
import {
  FolderKanban,
  CheckSquare,
  CheckCircle2,
  AlertTriangle,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DashboardClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    jobTitle?: string | null;
    avatarUrl?: string | null;
  };
  stats: {
    totalProjects: number;
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    completionRate: number;
  };
  velocityData: Array<{ date: string; completed: number; created: number }>;
  statusDistribution: Array<{ name: string; value: number; color: string }>;
  recentProjects: any[];
  upcomingTasks: any[];
  activities: any[];
  projectsList: Array<{ id: string; title: string }>;
}

export function DashboardClient({
  user,
  stats,
  velocityData,
  statusDistribution,
  recentProjects,
  upcomingTasks,
  activities,
  projectsList,
}: DashboardClientProps) {
  const router = useRouter();
  const [isProjectModalOpen, setIsProjectModalOpen] = React.useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);

  const refreshData = () => {
    router.refresh();
  };

  return (
    <AppLayout
      user={user}
      title="Workspace Dashboard"
      subtitle="Overview of project roadmaps, deadlines, and task velocities"
      onNewProject={() => setIsProjectModalOpen(true)}
      onNewTask={() => setIsTaskModalOpen(true)}
    >
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-r from-white via-indigo-50/20 to-white p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Welcome back, {user.name.split(" ")[0]}
                </h2>
                <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                  {user.jobTitle || "Workspace Lead"}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                You currently have {stats.totalTasks - stats.completedTasks} pending tasks across {stats.totalProjects} active projects.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsTaskModalOpen(true)}
              >
                <Plus className="w-4 h-4" />
                <span>New Task</span>
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsProjectModalOpen(true)}
              >
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Real-time Calculated KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Total Projects"
            value={stats.totalProjects}
            subtitle="Active workspace initiatives"
            icon={FolderKanban}
            accentColor="indigo"
          />
          <StatCard
            title="Total Tasks"
            value={stats.totalTasks}
            subtitle="Scoped work items"
            icon={CheckSquare}
            accentColor="sky"
          />
          <StatCard
            title="Completed Tasks"
            value={stats.completedTasks}
            subtitle={`${stats.completionRate}% completion rate`}
            icon={CheckCircle2}
            accentColor="emerald"
            trend={{ value: `${stats.completionRate}% Done`, isPositive: true }}
          />
          <StatCard
            title="Overdue Tasks"
            value={stats.overdueTasks}
            subtitle={stats.overdueTasks > 0 ? "Requires immediate attention" : "Zero overdue items"}
            icon={AlertTriangle}
            accentColor={stats.overdueTasks > 0 ? "rose" : "emerald"}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Velocity Area/Bar Chart (2 cols) */}
          <div className="lg:col-span-2 rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">7-Day Task Activity Velocity</h3>
                <p className="text-xs text-slate-500">Created vs. completed work items over time</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-slate-400" /> Created
                </span>
                <span className="flex items-center gap-1.5 text-indigo-700 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-indigo-600" /> Completed
                </span>
              </div>
            </div>
            <div className="mt-4">
              <TaskVelocityChart data={velocityData} />
            </div>
          </div>

          {/* Status Donut Chart (1 col) */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900 text-sm">Task Distribution</h3>
              <p className="text-xs text-slate-500">Current state of scoped items</p>
            </div>
            <div className="mt-4">
              <StatusDistributionChart data={statusDistribution} />
            </div>
          </div>
        </div>

        {/* Lists & Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RecentProjectsCard projects={recentProjects} />
          <UpcomingDeadlinesCard tasks={upcomingTasks} />
          <ActivityFeed activities={activities} />
        </div>
      </div>

      {/* Modals */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSuccess={refreshData}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSuccess={refreshData}
        projects={projectsList}
      />
    </AppLayout>
  );
}
