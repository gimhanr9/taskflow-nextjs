"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { KanbanBoard, type KanbanTask } from "@/components/tasks/KanbanBoard";
import { TaskListView } from "@/components/tasks/TaskListView";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { DeleteProjectDialog } from "@/components/projects/DeleteProjectDialog";
import { TaskModal } from "@/components/tasks/TaskModal";
import { DeleteTaskDialog } from "@/components/tasks/DeleteTaskDialog";
import {
  ArrowLeft,
  Calendar,
  Edit2,
  Trash2,
  Plus,
  LayoutGrid,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatRelativeDate, formatDate, getPriorityStyles, getStatusStyles, cn } from "@/lib/utils";

interface ProjectDetailClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    jobTitle?: string | null;
    avatarUrl?: string | null;
  };
  project: {
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
    tasks: any[];
  };
}

export function ProjectDetailClient({ user, project: initialProject }: ProjectDetailClientProps) {
  const router = useRouter();
  const [project, setProject] = React.useState(initialProject);
  const [tasks, setTasks] = React.useState<KanbanTask[]>(initialProject.tasks);
  const [viewMode, setViewMode] = React.useState<"kanban" | "list">("kanban");

  // Modals state
  const [isEditProjectOpen, setIsEditProjectOpen] = React.useState(false);
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = React.useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);
  const [defaultStatus, setDefaultStatus] = React.useState<"TODO" | "IN_PROGRESS" | "DONE">("TODO");
  const [editingTask, setEditingTask] = React.useState<KanbanTask | null>(null);
  const [deletingTask, setDeletingTask] = React.useState<KanbanTask | null>(null);

  const statusStyle = getStatusStyles(project.status);
  const priorityStyle = getPriorityStyles(project.priority);

  const refreshProject = async () => {
    try {
      const res = await fetch(`/api/projects/${project.id}`);
      const data = await res.json();
      if (data.project) {
        setProject(data.project);
        setTasks(data.project.tasks);
      }
    } catch {
      router.refresh();
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: "TODO" | "IN_PROGRESS" | "DONE") => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await fetch(`/api/tasks/${taskId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      refreshProject();
    } catch {
      refreshProject();
    }
  };

  const handleDeleteProject = async () => {
    try {
      const res = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/projects");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTask = async () => {
    if (!deletingTask) return;
    try {
      await fetch(`/api/tasks/${deletingTask.id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((t) => t.id !== deletingTask.id));
      refreshProject();
    } catch (e) {
      console.error(e);
    }
  };

  const openAddTaskWithStatus = (status: "TODO" | "IN_PROGRESS" | "DONE") => {
    setDefaultStatus(status);
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  return (
    <AppLayout
      user={user}
      title={project.title}
      subtitle="Project Roadmap & Scoped Deliverables"
      onNewTask={() => openAddTaskWithStatus("TODO")}
    >
      <div className="space-y-6">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </Link>
        </div>

        {/* Project Header Banner Card */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className="h-3.5 w-3.5 rounded-md shrink-0 shadow-2xs"
                  style={{ backgroundColor: project.color }}
                />
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {project.title}
                </h1>
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

              <p className="text-sm text-slate-600 leading-relaxed">
                {project.description || "No description provided."}
              </p>

              {/* Dates */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                {project.startDate && (
                  <span>
                    Started: <strong className="text-slate-700">{formatDate(project.startDate)}</strong>
                  </span>
                )}
                {project.dueDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Due: <strong className="text-slate-700">{formatDate(project.dueDate)}</strong> ({formatRelativeDate(project.dueDate)})
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditProjectOpen(true)}
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDeleteProjectOpen(true)}
                className="text-rose-600 hover:bg-rose-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => openAddTaskWithStatus("TODO")}
              >
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </Button>
            </div>
          </div>

          {/* Progress Bar in Card */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-700">Overall Milestone Progress</span>
              <span className="font-bold text-slate-900">
                {project.completedTasks} of {project.totalTasks} tasks completed ({project.progress}%)
              </span>
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
        </div>

        {/* View Switcher Bar */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">Project Tasks</h3>

          <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5 shadow-2xs">
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                viewMode === "kanban"
                  ? "bg-indigo-50 text-indigo-700 font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                viewMode === "list"
                  ? "bg-indigo-50 text-indigo-700 font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
          </div>
        </div>

        {/* Kanban Board or List View */}
        {viewMode === "kanban" ? (
          <KanbanBoard
            tasks={tasks}
            onStatusChange={handleStatusChange}
            onEditTask={(t) => {
              setEditingTask(t);
              setIsTaskModalOpen(true);
            }}
            onDeleteTask={(t) => setDeletingTask(t)}
            onAddTask={openAddTaskWithStatus}
          />
        ) : (
          <TaskListView
            tasks={tasks}
            onStatusChange={handleStatusChange}
            onEditTask={(t) => {
              setEditingTask(t);
              setIsTaskModalOpen(true);
            }}
            onDeleteTask={(t) => setDeletingTask(t)}
          />
        )}
      </div>

      {/* Edit Project Modal */}
      <ProjectModal
        isOpen={isEditProjectOpen}
        onClose={() => setIsEditProjectOpen(false)}
        onSuccess={refreshProject}
        projectToEdit={project}
      />

      {/* Delete Project Dialog */}
      <DeleteProjectDialog
        isOpen={isDeleteProjectOpen}
        onClose={() => setIsDeleteProjectOpen(false)}
        onConfirm={handleDeleteProject}
        projectTitle={project.title}
      />

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSuccess={refreshProject}
        defaultProjectId={project.id}
        defaultStatus={defaultStatus}
        taskToEdit={editingTask}
        projects={[{ id: project.id, title: project.title }]}
      />

      {/* Delete Task Dialog */}
      <DeleteTaskDialog
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteTask}
        taskTitle={deletingTask?.title || ""}
      />
    </AppLayout>
  );
}
