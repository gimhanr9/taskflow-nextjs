"use client";

import * as React from "react";
import {
  Calendar,
  Edit2,
  Trash2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  Plus,
} from "lucide-react";
import { formatRelativeDate, getPriorityStyles, cn } from "@/lib/utils";

export interface KanbanTask {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  dueDate?: Date | string | null;
  projectId: string;
  project?: {
    id: string;
    title: string;
    color: string;
  };
}

interface KanbanBoardProps {
  tasks: KanbanTask[];
  onStatusChange: (taskId: string, newStatus: "TODO" | "IN_PROGRESS" | "DONE") => Promise<void>;
  onEditTask: (task: KanbanTask) => void;
  onDeleteTask: (task: KanbanTask) => void;
  onAddTask: (status: "TODO" | "IN_PROGRESS" | "DONE") => void;
}

const COLUMNS: Array<{
  id: "TODO" | "IN_PROGRESS" | "DONE";
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badgeClass: string;
}> = [
  {
    id: "TODO",
    title: "To Do",
    icon: Circle,
    color: "border-t-slate-400",
    badgeClass: "bg-slate-100 text-slate-700",
  },
  {
    id: "IN_PROGRESS",
    title: "In Progress",
    icon: Clock,
    color: "border-t-indigo-600",
    badgeClass: "bg-indigo-50 text-indigo-700",
  },
  {
    id: "DONE",
    title: "Done",
    icon: CheckCircle2,
    color: "border-t-emerald-600",
    badgeClass: "bg-emerald-50 text-emerald-700",
  },
];

export function KanbanBoard({
  tasks,
  onStatusChange,
  onEditTask,
  onDeleteTask,
  onAddTask,
}: KanbanBoardProps) {
  const [draggedTaskId, setDraggedTaskId] = React.useState<string | null>(null);
  const [activeDropColumn, setActiveDropColumn] = React.useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (activeDropColumn !== columnId) {
      setActiveDropColumn(columnId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetColumn: "TODO" | "IN_PROGRESS" | "DONE") => {
    e.preventDefault();
    setActiveDropColumn(null);
    const taskId = e.dataTransfer.getData("text/plain") || draggedTaskId;
    setDraggedTaskId(null);

    if (!taskId) return;

    const task = tasks.find((t) => t.id === taskId);
    if (task && task.status !== targetColumn) {
      await onStatusChange(taskId, targetColumn);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.id);
        const Icon = column.icon;
        const isTargeted = activeDropColumn === column.id;

        return (
          <div
            key={column.id}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
            className={cn(
              "flex flex-col rounded-xl bg-slate-100/70 border-t-4 border border-slate-200/80 p-4 transition-colors min-h-[480px]",
              column.color,
              isTargeted && "bg-indigo-50/50 border-indigo-300 ring-2 ring-indigo-400/30"
            )}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-slate-500" />
                <h3 className="font-semibold text-slate-900 text-sm">{column.title}</h3>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-bold",
                    column.badgeClass
                  )}
                >
                  {columnTasks.length}
                </span>
              </div>

              <button
                onClick={() => onAddTask(column.id)}
                className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
                title={`Add task to ${column.title}`}
                aria-label={`Add task to ${column.title}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Task Cards Container */}
            <div className="flex-1 space-y-3">
              {columnTasks.length === 0 ? (
                <div
                  className={cn(
                    "h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-4 text-center transition-colors",
                    isTargeted
                      ? "border-indigo-400 bg-indigo-50/80 text-indigo-700"
                      : "border-slate-300 text-slate-400"
                  )}
                >
                  <p className="text-xs font-medium">
                    {isTargeted ? "Drop task here" : "No tasks here"}
                  </p>
                  <button
                    onClick={() => onAddTask(column.id)}
                    className="mt-2 text-[11px] text-indigo-600 font-semibold hover:underline cursor-pointer"
                  >
                    + Add Task
                  </button>
                </div>
              ) : (
                columnTasks.map((task) => {
                  const priority = getPriorityStyles(task.priority);
                  const isDragging = draggedTaskId === task.id;

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={() => setDraggedTaskId(null)}
                      className={cn(
                        "group relative rounded-lg border border-slate-200/90 bg-white p-4 shadow-2xs hover:shadow-sm transition-all cursor-grab active:cursor-grabbing select-none",
                        isDragging && "opacity-40 scale-95 border-dashed border-indigo-400",
                        task.status === "DONE" && "bg-slate-50/50"
                      )}
                    >
                      {/* Project Tag & Action Icons */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        {task.project ? (
                          <span
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border"
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
                            <span className="truncate max-w-[120px]">{task.project.title}</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">General</span>
                        )}

                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEditTask(task)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Edit task"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteTask(task)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h4
                        className={cn(
                          "text-sm font-semibold text-slate-900 leading-snug",
                          task.status === "DONE" && "line-through text-slate-500"
                        )}
                      >
                        {task.title}
                      </h4>

                      {task.description && (
                        <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {/* Card Footer: Priority, Due Date & Quick Column Shift */}
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border",
                              priority.bg
                            )}
                          >
                            <span className={cn("h-1.5 w-1.5 rounded-full", priority.dot)} />
                            {priority.label}
                          </span>

                          {task.dueDate && (
                            <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {formatRelativeDate(task.dueDate)}
                            </span>
                          )}
                        </div>

                        {/* Quick Shift Controls for Mobile / Keyboard Accessibility */}
                        <div className="flex items-center gap-1">
                          {column.id !== "TODO" && (
                            <button
                              onClick={() => {
                                const prevStatus = column.id === "DONE" ? "IN_PROGRESS" : "TODO";
                                onStatusChange(task.id, prevStatus);
                              }}
                              className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                              title="Move left"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                          )}
                          {column.id !== "DONE" && (
                            <button
                              onClick={() => {
                                const nextStatus = column.id === "TODO" ? "IN_PROGRESS" : "DONE";
                                onStatusChange(task.id, nextStatus);
                              }}
                              className="p-1 rounded text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 cursor-pointer"
                              title="Move right"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
