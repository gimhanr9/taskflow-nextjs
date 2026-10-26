"use client";

import * as React from "react";
import { CheckCircle2, Circle, Clock, Calendar, Edit2, Trash2 } from "lucide-react";
import { formatRelativeDate, getPriorityStyles, getStatusStyles, cn } from "@/lib/utils";
import { type KanbanTask } from "./KanbanBoard";

interface TaskListViewProps {
  tasks: KanbanTask[];
  onStatusChange: (taskId: string, newStatus: "TODO" | "IN_PROGRESS" | "DONE") => Promise<void>;
  onEditTask: (task: KanbanTask) => void;
  onDeleteTask: (task: KanbanTask) => void;
}

export function TaskListView({
  tasks,
  onStatusChange,
  onEditTask,
  onDeleteTask,
}: TaskListViewProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <Clock className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-slate-900">No tasks found</h3>
        <p className="mt-1 text-xs text-slate-500">
          Try adjusting your search criteria or create a new task.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/70 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="py-3 px-4 w-12 text-center">Done</th>
              <th className="py-3 px-4">Task Details</th>
              <th className="py-3 px-4">Project</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.map((task) => {
              const priority = getPriorityStyles(task.priority);
              const status = getStatusStyles(task.status);
              const isDone = task.status === "DONE";

              return (
                <tr
                  key={task.id}
                  className={cn(
                    "hover:bg-slate-50/80 transition-colors group",
                    isDone && "bg-slate-50/30"
                  )}
                >
                  {/* Done toggle checkbox */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() =>
                        onStatusChange(task.id, isDone ? "TODO" : "DONE")
                      }
                      className="cursor-pointer text-slate-400 hover:text-indigo-600 transition-colors"
                      title={isDone ? "Mark as Todo" : "Mark as Done"}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 inline" />
                      ) : (
                        <Circle className="w-5 h-5 inline hover:text-slate-600" />
                      )}
                    </button>
                  </td>

                  {/* Title & Description */}
                  <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                    <p
                      className={cn(
                        "font-semibold text-slate-900 line-clamp-1",
                        isDone && "line-through text-slate-500"
                      )}
                    >
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {task.description}
                      </p>
                    )}
                  </td>

                  {/* Project Tag */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {task.project ? (
                      <span
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border"
                        style={{
                          borderColor: `${task.project.color}30`,
                          backgroundColor: `${task.project.color}10`,
                          color: task.project.color,
                        }}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: task.project.color }}
                        />
                        <span className="truncate max-w-[130px]">{task.project.title}</span>
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
                        status.bg
                      )}
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
                      {status.label}
                    </span>
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider border",
                        priority.bg
                      )}
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full", priority.dot)} />
                      {priority.label}
                    </span>
                  </td>

                  {/* Due Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                    {task.dueDate ? (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatRelativeDate(task.dueDate)}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditTask(task)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Edit task"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTask(task)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
