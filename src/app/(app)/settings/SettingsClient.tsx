"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SettingsView } from "@/components/settings/SettingsView";

interface SettingsClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    jobTitle?: string | null;
    bio?: string | null;
    avatarUrl?: string | null;
  };
}

export function SettingsClient({ user }: SettingsClientProps) {
  return (
    <AppLayout
      user={user}
      title="Account Settings"
      subtitle="Manage your profile information, password credentials, and workspace preferences"
    >
      <SettingsView user={user} />
    </AppLayout>
  );
}
