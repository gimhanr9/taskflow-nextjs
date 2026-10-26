"use client";

import * as React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface AppLayoutProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    jobTitle?: string | null;
    avatarUrl?: string | null;
  };
  title: string;
  subtitle?: string;
  onNewTask?: () => void;
  onNewProject?: () => void;
  children: React.ReactNode;
}

export function AppLayout({
  user,
  title,
  subtitle,
  onNewTask,
  onNewProject,
  children,
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Navigation */}
      <Sidebar
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <Header
          title={title}
          subtitle={subtitle}
          onOpenSidebar={() => setSidebarOpen(true)}
          onNewTask={onNewTask}
          onNewProject={onNewProject}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
