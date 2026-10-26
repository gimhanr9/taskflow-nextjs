"use client";

import * as React from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

interface TaskFormData {
  id?: string;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  projectId: string;
  dueDate: string;
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultProjectId?: string;
  defaultStatus?: "TODO" | "IN_PROGRESS" | "DONE";
  taskToEdit?: {
    id: string;
    title: string;
    description?: string | null;
    status: string;
    priority: string;
    projectId: string;
    dueDate?: Date | string | null;
  } | null;
  projects?: Array<{ id: string; title: string }>;
}

export function TaskModal({
  isOpen,
  onClose,
  onSuccess,
  defaultProjectId,
  defaultStatus,
  taskToEdit,
  projects: initialProjects,
}: TaskModalProps) {
  const [projectsList, setProjectsList] = React.useState<Array<{ id: string; title: string }>>(
    initialProjects || []
  );
  const [formData, setFormData] = React.useState<TaskFormData>({
    title: "",
    description: "",
    status: defaultStatus || "TODO",
    priority: "MEDIUM",
    projectId: defaultProjectId || "",
    dueDate: "",
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Fetch projects if not provided
  React.useEffect(() => {
    if (isOpen && (!initialProjects || initialProjects.length === 0)) {
      fetch("/api/projects")
        .then((res) => res.json())
        .then((data) => {
          if (data.projects) {
            setProjectsList(data.projects);
            if (!formData.projectId && data.projects.length > 0) {
              setFormData((prev) => ({
                ...prev,
                projectId: defaultProjectId || data.projects[0].id,
              }));
            }
          }
        })
        .catch(console.error);
    }
  }, [isOpen, initialProjects, defaultProjectId, formData.projectId]);

  React.useEffect(() => {
    if (taskToEdit) {
      setFormData({
        id: taskToEdit.id,
        title: taskToEdit.title,
        description: taskToEdit.description || "",
        status: (taskToEdit.status as any) || "TODO",
        priority: (taskToEdit.priority as any) || "MEDIUM",
        projectId: taskToEdit.projectId,
        dueDate: taskToEdit.dueDate
          ? new Date(taskToEdit.dueDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: defaultStatus || "TODO",
        priority: "MEDIUM",
        projectId: defaultProjectId || (projectsList[0]?.id ?? ""),
        dueDate: "",
      });
    }
    setErrors({});
  }, [taskToEdit, isOpen, defaultStatus, defaultProjectId, projectsList]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!formData.title.trim()) {
      setErrors({ title: "Task title is required" });
      return;
    }

    if (!formData.projectId) {
      setErrors({ projectId: "Please select a project" });
      return;
    }

    try {
      setIsSubmitting(true);
      const url = taskToEdit ? `/api/tasks/${taskToEdit.id}` : "/api/tasks";
      const method = taskToEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          status: formData.status,
          priority: formData.priority,
          projectId: formData.projectId,
          dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          const formatted: Record<string, string> = {};
          for (const key of Object.keys(data.details)) {
            formatted[key] = data.details[key][0];
          }
          setErrors(formatted);
        } else {
          setErrors({ general: data.error || "Failed to save task" });
        }
        return;
      }

      onSuccess();
      onClose();
    } catch {
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? "Edit Task" : "Create New Task"}
      description="Define the task objectives, due date, and priority level."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
            {errors.general}
          </div>
        )}

        <Input
          label="Task Title"
          placeholder="e.g. Design responsive navbar component"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={errors.title}
          required
        />

        <Textarea
          label="Description"
          placeholder="Details, acceptance criteria, or technical notes..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Project"
            value={formData.projectId}
            onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
            error={errors.projectId}
            options={
              projectsList.length > 0
                ? projectsList.map((p) => ({ label: p.title, value: p.id }))
                : [{ label: "No projects available", value: "" }]
            }
          />

          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
            options={[
              { label: "Low", value: "LOW" },
              { label: "Medium", value: "MEDIUM" },
              { label: "High", value: "HIGH" },
              { label: "Urgent", value: "URGENT" },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            options={[
              { label: "Todo", value: "TODO" },
              { label: "In Progress", value: "IN_PROGRESS" },
              { label: "Done", value: "DONE" },
            ]}
          />

          <Input
            type="date"
            label="Due Date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {taskToEdit ? "Save Changes" : "Create Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
