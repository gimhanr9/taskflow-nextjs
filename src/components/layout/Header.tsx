"use client";

import * as React from "react";
import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onOpenSidebar: () => void;
  onNewTask?: () => void;
  onNewProject?: () => void;
}

export function Header({
  title,
  subtitle,
  onOpenSidebar,
  onNewTask,
  onNewProject,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-xs sm:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight sm:text-xl">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {onNewTask && (
          <Button
            size="sm"
            variant="outline"
            onClick={onNewTask}
            className="hidden sm:inline-flex"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </Button>
        )}

        {onNewProject && (
          <Button size="sm" variant="primary" onClick={onNewProject}>
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Button>
        )}
      </div>
    </header>
  );
}
