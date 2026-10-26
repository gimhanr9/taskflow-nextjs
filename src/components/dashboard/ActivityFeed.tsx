import * as React from "react";
import { formatRelativeDate } from "@/lib/utils";
import { Activity, CheckCircle2, FolderPlus, Edit3, UserCheck } from "lucide-react";

interface ActivityFeedProps {
  activities: Array<{
    id: string;
    action: string;
    details: string;
    entityType: string;
    createdAt: Date | string;
  }>;
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case "TASK_COMPLETED":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case "PROJECT_CREATED":
        return <FolderPlus className="w-4 h-4 text-indigo-600" />;
      case "PROFILE_UPDATED":
      case "ACCOUNT_CREATED":
        return <UserCheck className="w-4 h-4 text-sky-600" />;
      default:
        return <Edit3 className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-semibold text-slate-900 text-sm">Recent Activity</h3>
          <p className="text-xs text-slate-500">Live timeline of actions across your workspace</p>
        </div>
        <Activity className="w-4 h-4 text-slate-400" />
      </div>

      <div className="mt-4 space-y-4">
        {activities.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            No recent activity recorded yet.
          </div>
        ) : (
          activities.slice(0, 6).map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 mt-0.5 shrink-0">
                {getActionIcon(activity.action)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-800 leading-snug">
                  {activity.details}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {formatRelativeDate(activity.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
