"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { KanvoroLogoMark } from "@/components/common/KanvoroLogoMark";

export default function RegisterPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [jobTitle, setJobTitle] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDemoLoading, setIsDemoLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          jobTitle: jobTitle.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create account");
        return;
      }

      window.location.href = "/dashboard";
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      setIsDemoLoading(true);
      setError(null);
      const res = await fetch("/api/auth/demo", { method: "POST" });
      if (res.ok) {
        window.location.href = "/dashboard";
      } else {
        setError("Failed to initialize demo session");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/20 group-hover:from-violet-700 group-hover:to-indigo-700 transition-all">
            <KanvoroLogoMark className="h-5 w-5" />
          </div>
          <span className="font-bold text-slate-900 text-2xl tracking-tight">Kanvoro</span>
        </Link>
        <h2 className="text-xl font-bold text-slate-900">Create your workspace</h2>
        <p className="mt-1 text-xs text-slate-500">
          Get started with isolated project boards and real-time tracking.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm rounded-2xl border border-slate-200/80 sm:px-10">
          {/* Quick Demo One-Click Login */}
          <div className="mb-6 pb-6 border-b border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={handleDemoLogin}
              isLoading={isDemoLoading}
              className="w-full border-indigo-200 bg-indigo-50/50 text-indigo-700 hover:bg-indigo-100/70"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Or Explore via Demo Account</span>
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
                {error}
              </div>
            )}

            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. Jordan Miller"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="jordan@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Role or Job Title (Optional)"
              type="text"
              placeholder="e.g. Full-Stack Developer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />

            <Input
              label="Password (min. 8 characters)"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
