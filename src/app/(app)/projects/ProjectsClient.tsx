"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProjectCard, type ProjectData } from "@/components/projects/ProjectCard";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { DeleteProjectDialog } from "@/components/projects/DeleteProjectDialog";
import { FolderKanban, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ProjectsClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    jobTitle?: string | null;
    avatarUrl?: string | null;
  };
  initialProjects: ProjectData[];
}

export function ProjectsClient({ user, initialProjects }: ProjectsClientProps) {
  const router = useRouter();
  const [projects, setProjects] = React.useState<ProjectData[]>(initialProjects);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("ALL");
  const [priority, setPriority] = React.useState("ALL");
  const [sort, setSort] = React.useState("newest");

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<ProjectData | null>(null);
  const [deletingProject, setDeletingProject] = React.useState<ProjectData | null>(null);

  // Sync when initialProjects change
  React.useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const refreshData = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch {
      router.refresh();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProject) return;
    try {
      const res = await fetch(`/api/projects/${deletingProject.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== deletingProject.id));
        refreshData();
      }
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  // Client-side filtering & sorting
  const filteredProjects = projects
    .filter((p) => {
      const matchesSearch =
        search === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = status === "ALL" || p.status === status;
      const matchesPriority = priority === "ALL" || p.priority === priority;

      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      if (sort === "oldest") return new Date(a.startDate || 0).getTime() - new Date(b.startDate || 0).getTime();
      if (sort === "due_soon") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sort === "title") return a.title.localeCompare(b.title);
      return b.id.localeCompare(a.id); // Default newest
    });

  return (
    <AppLayout
      user={user}
      title="Projects"
      subtitle="Organize, prioritize, and monitor progress across all workspaces"
      onNewProject={() => setIsCreateOpen(true)}
    >
      <div className="space-y-6">
        {/* Filters and search bar */}
        <ProjectFilters
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          priority={priority}
          onPriorityChange={setPriority}
          sort={sort}
          onSortChange={setSort}
        />

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <FolderKanban className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No projects found</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              {search || status !== "ALL" || priority !== "ALL"
                ? "Try clearing your filters or search keywords."
                : "Create your first project to organize tasks, track milestones, and view progress."}
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              className="mt-4"
            >
              <Plus className="w-4 h-4" />
              <span>Create Project</span>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={(p) => setEditingProject(p)}
                onDelete={(p) => setDeletingProject(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <ProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={refreshData}
      />

      <ProjectModal
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        onSuccess={refreshData}
        projectToEdit={editingProject}
      />

      <DeleteProjectDialog
        isOpen={!!deletingProject}
        onClose={() => setDeletingProject(null)}
        onConfirm={handleDeleteConfirm}
        projectTitle={deletingProject?.title || ""}
      />
    </AppLayout>
  );
}
