import * as React from "react";
import Link from "next/link";
import { Calendar, Edit2, Trash2, CheckSquare } from "lucide-react";
import { formatRelativeDate, getPriorityStyles, getStatusStyles, cn } from "@/lib/utils";

export interface ProjectData {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  color: string;
  startDate?: Date | string | null;
  dueDate?: Date | string | null;
  totalTasks: number;
  completedTasks: number;
  progress: number;
}

interface ProjectCardProps {
  project: ProjectData;
  onEdit: (project: ProjectData) => void;
  onDelete: (project: ProjectData) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const statusStyle = getStatusStyles(project.status);
  const priorityStyle = getPriorityStyles(project.priority);

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-xs transition-all group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className="h-3.5 w-3.5 rounded-md shrink-0 shadow-2xs"
              style={{ backgroundColor: project.color }}
            />
            <Link
              href={`/projects/${project.id}`}
              className="font-bold text-slate-900 text-base hover:text-indigo-600 transition-colors truncate"
            >
              {project.title}
            </Link>
          </div>

          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={() => onEdit(project)}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Edit project"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(project)}
              className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Delete project"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed min-h-[32px]">
          {project.description || "No description provided."}
        </p>

        {/* Badges */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border",
              statusStyle.bg
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", statusStyle.dot)} />
            {statusStyle.label}
          </span>

          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider border",
              priorityStyle.bg
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", priorityStyle.dot)} />
            {priorityStyle.label}
          </span>
        </div>
      </div>

      {/* Footer Details */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="flex items-center gap-1 font-medium">
              <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
              {project.completedTasks} / {project.totalTasks} tasks
            </span>
            <span className="font-bold text-slate-700">{project.progress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${project.progress}%`,
                backgroundColor: project.color,
              }}
            />
          </div>
        </div>

        {/* Due date and Link */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          {project.dueDate ? (
            <span className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Due {formatRelativeDate(project.dueDate)}
            </span>
          ) : (
            <span>No deadline</span>
          )}

          <Link
            href={`/projects/${project.id}`}
            className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
