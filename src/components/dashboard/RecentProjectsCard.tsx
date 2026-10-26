import * as React from "react";
import Link from "next/link";
import { ArrowRight, FolderKanban } from "lucide-react";
import { getStatusStyles, cn } from "@/lib/utils";

interface RecentProjectsCardProps {
  projects: Array<{
    id: string;
    title: string;
    status: string;
    color: string;
    progress: number;
    totalTasks: number;
    completedTasks: number;
    dueDate?: Date | string | null;
  }>;
}

export function RecentProjectsCard({ projects }: RecentProjectsCardProps) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-semibold text-slate-900 text-sm">Active Projects</h3>
          <p className="text-xs text-slate-500">Track progress across key initiatives</p>
        </div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="mt-4 space-y-4">
        {projects.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            <FolderKanban className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            No projects found. Create your first project to get started!
          </div>
        ) : (
          projects.slice(0, 4).map((project) => {
            const statusStyle = getStatusStyles(project.status);

            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: project.color }}
                    />
                    <h4 className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {project.title}
                    </h4>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider shrink-0 border",
                      statusStyle.bg
                    )}
                  >
                    {statusStyle.label}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>{project.completedTasks} of {project.totalTasks} tasks</span>
                    <span className="font-semibold text-slate-700">{project.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${project.progress}%`,
                        backgroundColor: project.color,
                      }}
                    />
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
