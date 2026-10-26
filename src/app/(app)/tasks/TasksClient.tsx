"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { KanbanBoard, type KanbanTask } from "@/components/tasks/KanbanBoard";
import { TaskListView } from "@/components/tasks/TaskListView";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TaskModal } from "@/components/tasks/TaskModal";
import { DeleteTaskDialog } from "@/components/tasks/DeleteTaskDialog";
import { ProjectModal } from "@/components/projects/ProjectModal";

interface TasksClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    jobTitle?: string | null;
    avatarUrl?: string | null;
  };
  initialTasks: KanbanTask[];
  projects: Array<{ id: string; title: string }>;
}

export function TasksClient({ user, initialTasks, projects }: TasksClientProps) {
  const router = useRouter();
  const [tasks, setTasks] = React.useState<KanbanTask[]>(initialTasks);
  const [viewMode, setViewMode] = React.useState<"kanban" | "list">("kanban");

  // Filters state
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("ALL");
  const [priority, setPriority] = React.useState("ALL");
  const [projectId, setProjectId] = React.useState("ALL");

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);
  const [defaultStatus, setDefaultStatus] = React.useState<"TODO" | "IN_PROGRESS" | "DONE">("TODO");
  const [editingTask, setEditingTask] = React.useState<KanbanTask | null>(null);
  const [deletingTask, setDeletingTask] = React.useState<KanbanTask | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = React.useState(false);

  React.useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const refreshTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      if (data.tasks) {
        setTasks(data.tasks);
      }
    } catch {
      router.refresh();
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: "TODO" | "IN_PROGRESS" | "DONE") => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await fetch(`/api/tasks/${taskId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      refreshTasks();
    } catch {
      refreshTasks();
    }
  };

  const handleDeleteTask = async () => {
    if (!deletingTask) return;
    try {
      await fetch(`/api/tasks/${deletingTask.id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((t) => t.id !== deletingTask.id));
      refreshTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const openAddTaskWithStatus = (status: "TODO" | "IN_PROGRESS" | "DONE") => {
    setDefaultStatus(status);
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      search === "" ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(search.toLowerCase()));

    const matchesProject = projectId === "ALL" || t.projectId === projectId;
    const matchesPriority = priority === "ALL" || t.priority === priority;
    const matchesStatus = viewMode === "kanban" || status === "ALL" || t.status === status;

    return matchesSearch && matchesProject && matchesPriority && matchesStatus;
  });

  return (
    <AppLayout
      user={user}
      title="Tasks & Kanban"
      subtitle="Interactive sprint board with real-time status transitions"
      onNewTask={() => openAddTaskWithStatus("TODO")}
      onNewProject={() => setIsProjectModalOpen(true)}
    >
      <div className="space-y-6">
        {/* Task Filters */}
        <TaskFilters
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          priority={priority}
          onPriorityChange={setPriority}
          projectId={projectId}
          onProjectIdChange={setProjectId}
          projects={projects}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* View Component */}
        {viewMode === "kanban" ? (
          <KanbanBoard
            tasks={filteredTasks}
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
            tasks={filteredTasks}
            onStatusChange={handleStatusChange}
            onEditTask={(t) => {
              setEditingTask(t);
              setIsTaskModalOpen(true);
            }}
            onDeleteTask={(t) => setDeletingTask(t)}
          />
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSuccess={refreshTasks}
        defaultStatus={defaultStatus}
        taskToEdit={editingTask}
        projects={projects}
      />

      {/* Delete Task Dialog */}
      <DeleteTaskDialog
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteTask}
        taskTitle={deletingTask?.title || ""}
      />

      {/* New Project Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSuccess={() => router.refresh()}
      />
    </AppLayout>
  );
}
