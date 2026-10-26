"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { KanvoroLogoMark } from "@/components/common/KanvoroLogoMark";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDemoLoading, setIsDemoLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid email or password");
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
        setError("Failed to initialize demo account session");
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
        <h2 className="text-xl font-bold text-slate-900">Sign in to your account</h2>
        <p className="mt-1 text-xs text-slate-500">
          Enter your credentials or test with the portfolio demo account.
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
              <span>One-Click Demo Sign In</span>
            </Button>
            <p className="text-[11px] text-center text-slate-400 mt-2">
              Instantly signs in as <span className="font-semibold text-slate-600">demo@kanvoro.dev</span> with sample projects.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
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
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
