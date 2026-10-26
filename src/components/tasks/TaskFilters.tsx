"use client";

import * as React from "react";
import { Search, LayoutGrid, List } from "lucide-react";

interface TaskFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  priority: string;
  onPriorityChange: (value: string) => void;
  projectId: string;
  onProjectIdChange: (value: string) => void;
  projects: Array<{ id: string; title: string }>;
  viewMode: "kanban" | "list";
  onViewModeChange: (mode: "kanban" | "list") => void;
}

export function TaskFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  projectId,
  onProjectIdChange,
  projects,
  viewMode,
  onViewModeChange,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search tasks by title or notes..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors"
        />
      </div>

      {/* Selectors and View Switcher */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={projectId}
          onChange={(e) => onProjectIdChange(e.target.value)}
          className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 cursor-pointer focus:outline-none focus:border-indigo-600"
        >
          <option value="ALL">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>

        {viewMode === "list" && (
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 cursor-pointer focus:outline-none focus:border-indigo-600"
          >
            <option value="ALL">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        )}

        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 cursor-pointer focus:outline-none focus:border-indigo-600"
        >
          <option value="ALL">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>

        {/* View Toggle */}
        <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5">
          <button
            type="button"
            onClick={() => onViewModeChange("kanban")}
            className={`p-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
              viewMode === "kanban"
                ? "bg-white text-indigo-700 shadow-2xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="Kanban Board View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            className={`p-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
              viewMode === "list"
                ? "bg-white text-indigo-700 shadow-2xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="List Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
