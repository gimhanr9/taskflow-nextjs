"use client";

import * as React from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

interface ProjectFormData {
  id?: string;
  title: string;
  description: string;
  status: "PLANNING" | "ACTIVE" | "COMPLETED" | "ON_HOLD";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  color: string;
  startDate: string;
  dueDate: string;
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectToEdit?: {
    id: string;
    title: string;
    description?: string | null;
    status: string;
    priority: string;
    color: string;
    startDate?: Date | string | null;
    dueDate?: Date | string | null;
  } | null;
}

const COLOR_PRESETS = [
  { name: "Indigo", value: "#4f46e5" },
  { name: "Sky", value: "#0284c7" },
  { name: "Emerald", value: "#059669" },
  { name: "Amber", value: "#d97706" },
  { name: "Rose", value: "#e11d48" },
  { name: "Purple", value: "#9333ea" },
];

export function ProjectModal({
  isOpen,
  onClose,
  onSuccess,
  projectToEdit,
}: ProjectModalProps) {
  const [formData, setFormData] = React.useState<ProjectFormData>({
    title: "",
    description: "",
    status: "ACTIVE",
    priority: "MEDIUM",
    color: "#4f46e5",
    startDate: "",
    dueDate: "",
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (projectToEdit) {
      setFormData({
        id: projectToEdit.id,
        title: projectToEdit.title,
        description: projectToEdit.description || "",
        status: (projectToEdit.status as any) || "ACTIVE",
        priority: (projectToEdit.priority as any) || "MEDIUM",
        color: projectToEdit.color || "#4f46e5",
        startDate: projectToEdit.startDate
          ? new Date(projectToEdit.startDate).toISOString().split("T")[0]
          : "",
        dueDate: projectToEdit.dueDate
          ? new Date(projectToEdit.dueDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "ACTIVE",
        priority: "MEDIUM",
        color: "#4f46e5",
        startDate: "",
        dueDate: "",
      });
    }
    setErrors({});
  }, [projectToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!formData.title.trim()) {
      setErrors({ title: "Project title is required" });
      return;
    }

    try {
      setIsSubmitting(true);
      const url = projectToEdit ? `/api/projects/${projectToEdit.id}` : "/api/projects";
      const method = projectToEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          status: formData.status,
          priority: formData.priority,
          color: formData.color,
          startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
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
          setErrors({ general: data.error || "Failed to save project" });
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
      title={projectToEdit ? "Edit Project" : "Create New Project"}
      description="Organize tasks, assign priorities, and set milestones for your initiative."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
            {errors.general}
          </div>
        )}

        <Input
          label="Project Title"
          placeholder="e.g. Q3 Mobile Redesign"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={errors.title}
          required
        />

        <Textarea
          label="Description"
          placeholder="Summary of goals, deliverables, and team responsibilities..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            options={[
              { label: "Active", value: "ACTIVE" },
              { label: "Planning", value: "PLANNING" },
              { label: "On Hold", value: "ON_HOLD" },
              { label: "Completed", value: "COMPLETED" },
            ]}
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

        {/* Color Accent Picker */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Accent Color
          </label>
          <div className="flex items-center gap-3">
            {COLOR_PRESETS.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setFormData({ ...formData, color: color.value })}
                className="h-7 w-7 rounded-full transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 cursor-pointer"
                style={{
                  backgroundColor: color.value,
                  transform: formData.color === color.value ? "scale(1.2)" : "scale(1)",
                  boxShadow: formData.color === color.value ? `0 0 0 2px white, 0 0 0 4px ${color.value}` : "none",
                }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="date"
            label="Start Date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
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
            {projectToEdit ? "Save Changes" : "Create Project"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
