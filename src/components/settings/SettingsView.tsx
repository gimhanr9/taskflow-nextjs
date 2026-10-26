"use client";

import * as React from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, User, Lock, Database, CheckCircle2 } from "lucide-react";

interface SettingsViewProps {
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

export function SettingsView({ user }: SettingsViewProps) {
  const [activeTab, setActiveTab] = React.useState<"profile" | "security" | "system">("profile");

  // Profile Form state
  const [name, setName] = React.useState(user.name);
  const [jobTitle, setJobTitle] = React.useState(user.jobTitle || "");
  const [bio, setBio] = React.useState(user.bio || "");
  const [avatarUrl, setAvatarUrl] = React.useState(user.avatarUrl || "");
  const [profileLoading, setProfileLoading] = React.useState(false);
  const [profileSuccess, setProfileSuccess] = React.useState(false);
  const [profileError, setProfileError] = React.useState<string | null>(null);

  // Password Form state
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordLoading, setPasswordLoading] = React.useState(false);
  const [passwordSuccess, setPasswordSuccess] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);

  const isDemo = user.email === "demo@kanvoro.dev" || user.email === "demo@taskflow.dev";

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(false);

    try {
      setProfileLoading(true);
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          jobTitle: jobTitle.trim() || null,
          bio: bio.trim() || null,
          avatarUrl: avatarUrl.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setProfileError(data.error || "Failed to update profile");
        return;
      }

      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch {
      setProfileError("Network error. Please try again.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      setPasswordLoading(true);
      const res = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error || "Failed to update password");
        return;
      }

      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 4000);
    } catch {
      setPasswordError("Network error. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "profile"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Bio</span>
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "security"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Security & Password</span>
        </button>

        <button
          onClick={() => setActiveTab("system")}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "system"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Architecture & Tenancy</span>
        </button>
      </div>

      {/* Tab 1: Profile */}
      {activeTab === "profile" && (
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs max-w-2xl">
          <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Update your public profile, job title, and bio across the workspace.
          </p>

          <form onSubmit={handleProfileSubmit} className="mt-6 space-y-4">
            {profileSuccess && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            {profileError && (
              <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
                {profileError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <div className="w-full space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="flex h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-500 cursor-not-allowed"
                />
                <p className="text-[11px] text-slate-400">Email is tied to your account tenancy.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Job Title / Role"
                placeholder="e.g. Senior Full-Stack Architect"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />

              <Input
                label="Avatar URL (Optional)"
                placeholder="https://images.unsplash.com/..."
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
              />
            </div>

            <Textarea
              label="Bio"
              placeholder="Short description of your skills, role, and focus..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
            />

            <div className="pt-2">
              <Button type="submit" variant="primary" isLoading={profileLoading}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Security */}
      {activeTab === "security" && (
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs max-w-2xl">
          <h3 className="text-base font-bold text-slate-900">Change Password</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Ensure your account uses a secure password with at least 8 characters.
          </p>

          {isDemo && (
            <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Portfolio Demo Account Protected</p>
                <p className="mt-1 text-amber-800">
                  Password changes are disabled for the pre-configured demo account (<code className="bg-amber-100 px-1 py-0.5 rounded font-mono">demo@kanvoro.dev</code>) so portfolio visitors and freelance clients can consistently explore the live application.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
            {passwordSuccess && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Password updated successfully!</span>
              </div>
            )}

            {passwordError && (
              <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
                {passwordError}
              </div>
            )}

            <Input
              type="password"
              label="Current Password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isDemo}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="password"
                label="New Password"
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isDemo}
                required
              />

              <Input
                type="password"
                label="Confirm New Password"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isDemo}
                required
              />
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" disabled={isDemo} isLoading={passwordLoading}>
                Update Password
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: System Architecture & Tenancy */}
      {activeTab === "system" && (
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs max-w-3xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Architecture & Tenancy Design</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Technical overview of how Kanvoro enforces data isolation, secure authentication, and relational persistence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Row-Level User Tenancy
              </h4>
              <p className="mt-2 text-slate-600 leading-relaxed">
                All projects, tasks, and audit logs are strictly scoped with <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">userId</code> foreign keys. Every server-side endpoint validates session ownership, preventing horizontal privilege escalation.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                Stateless JWT Sessions via Jose
              </h4>
              <p className="mt-2 text-slate-600 leading-relaxed">
                Tokens are signed with HS256 using an encrypted secret and stored in <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">HttpOnly</code>, <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">SameSite=Lax</code> cookies to prevent XSS session theft.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-sky-500" />
                PostgreSQL & Prisma ORM
              </h4>
              <p className="mt-2 text-slate-600 leading-relaxed">
                Relational integrity is guarded with native compound indexes and cascade deletes. Deleting a project automatically cleans all nested tasks and activities cleanly.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Type-Safe Zod Validation
              </h4>
              <p className="mt-2 text-slate-600 leading-relaxed">
                Client submissions pass through strict Zod schemas before touching Prisma models, rejecting malformed payloads, excessive lengths, and invalid status transitions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
