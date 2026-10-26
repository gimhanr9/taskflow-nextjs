import * as React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, AlertCircle } from "lucide-react";
import { formatRelativeDate, getPriorityStyles, cn } from "@/lib/utils";

interface UpcomingDeadlinesCardProps {
  tasks: Array<{
    id: string;
    title: string;
    priority: string;
    dueDate: Date | string | null;
    status: string;
    project?: {
      id: string;
      title: string;
      color: string;
    };
  }>;
}

export function UpcomingDeadlinesCard({ tasks }: UpcomingDeadlinesCardProps) {
  const now = React.useMemo(() => Date.now(), []);

  // Only tasks not DONE that have a due date
  const pendingTasks = tasks
    .filter((t) => t.status !== "DONE" && t.dueDate)
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5);

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-semibold text-slate-900 text-sm">Upcoming Deadlines</h3>
          <p className="text-xs text-slate-500">Keep critical deliverables on schedule</p>
        </div>
        <Link
          href="/tasks"
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <span>View Kanban</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        {pendingTasks.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            No pending tasks with upcoming deadlines. Great job!
          </div>
        ) : (
          pendingTasks.map((task) => {
            const priority = getPriorityStyles(task.priority);
            const isOverdue = new Date(task.dueDate!).getTime() < now;

            return (
              <div
                key={task.id}
                className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50/50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {isOverdue && (
                      <span title="Overdue">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      </span>
                    )}
                    <h4 className="text-sm font-semibold text-slate-900 truncate">
                      {task.title}
                    </h4>
                  </div>
                  {task.project && (
                    <p className="text-xs text-slate-400 mt-0.5 truncate">
                      {task.project.title}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded border uppercase",
                      priority.bg
                    )}
                  >
                    {priority.label}
                  </span>

                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-1 rounded-md",
                      isOverdue
                        ? "bg-rose-50 text-rose-700 font-semibold"
                        : "bg-slate-100 text-slate-700"
                    )}
                  >
                    {formatRelativeDate(task.dueDate)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
