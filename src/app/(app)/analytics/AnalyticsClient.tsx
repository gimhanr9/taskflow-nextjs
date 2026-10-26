"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AnalyticsView } from "@/components/analytics/AnalyticsView";

interface AnalyticsClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    jobTitle?: string | null;
    avatarUrl?: string | null;
  };
  stats: any;
  velocityData: any[];
  statusData: any[];
  priorityData: any[];
  projects: any[];
}

export function AnalyticsClient({
  user,
  stats,
  velocityData,
  statusData,
  priorityData,
  projects,
}: AnalyticsClientProps) {
  return (
    <AppLayout
      user={user}
      title="Analytics & Velocity"
      subtitle="Data-driven insights into team sprint health, backlog volume, and deliverables"
    >
      <AnalyticsView
        stats={stats}
        velocityData={velocityData}
        statusData={statusData}
        priorityData={priorityData}
        projects={projects}
      />
    </AppLayout>
  );
}
