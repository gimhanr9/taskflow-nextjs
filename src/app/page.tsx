"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  LayoutGrid,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { KanvoroLogoMark } from "@/components/common/KanvoroLogoMark";

export default function LandingPage() {
  const router = useRouter();
  const [isDemoLoading, setIsDemoLoading] = React.useState(false);

  const handleDemoLogin = async () => {
    try {
      setIsDemoLoading(true);
      const res = await fetch("/api/auth/demo", { method: "POST" });
      if (res.ok) {
        window.location.href = "/dashboard";
      } else {
        router.push("/login");
      }
    } catch {
      router.push("/login");
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/20 group-hover:from-violet-700 group-hover:to-indigo-700 transition-all">
              <KanvoroLogoMark className="h-5 w-5" />
            </div>
            <span className="font-bold text-slate-900 text-xl tracking-tight">Kanvoro</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#workflow" className="hover:text-slate-900 transition-colors">Workflow</a>
            <a href="#architecture" className="hover:text-slate-900 transition-colors">Architecture</a>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDemoLogin}
              isLoading={isDemoLoading}
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Explore Live Demo</span>
            </Button>
            <Link href="/login">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-24 overflow-hidden border-b border-slate-200/60 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Production Full-Stack SaaS Portfolio Project</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.12]">
            Project management built for speed, clarity, and precision.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Kanvoro combines intuitive Kanban drag-and-drop workflows, real-time completion velocity metrics, and robust PostgreSQL tenancy in a clean, distraction-free interface.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={handleDemoLogin}
              isLoading={isDemoLoading}
              className="w-full sm:w-auto shadow-md shadow-indigo-600/20"
            >
              <span>Launch Demo Account</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <Link href="/register" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full">
                Create Free Account
              </Button>
            </Link>
          </div>

          {/* Key Trust Signals */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" /> PostgreSQL & Prisma Persistence
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" /> Stateless JWT Sessions
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" /> Strict Tenant Data Isolation
            </span>
          </div>

          {/* Interactive Product Preview Card Mockup */}
          <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-slate-200/90 bg-white p-2 sm:p-4 shadow-xl">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-6 text-left">
              {/* Fake top bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  <span className="ml-3 text-xs font-bold text-slate-700">Kanvoro — Active Workspace</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>PostgreSQL Connected</span>
                </div>
              </div>

              {/* Preview 3-column Kanban visual */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Column 1 */}
                <div className="rounded-lg bg-white border border-slate-200 p-3 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs font-bold text-slate-700">
                    <span>TO DO</span>
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">2</span>
                  </div>
                  <div className="p-2.5 rounded-md bg-slate-50 border border-slate-100 mb-2">
                    <p className="text-xs font-semibold text-slate-800">Add keyboard focus rings</p>
                    <span className="inline-block mt-2 text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-medium">Low</span>
                  </div>
                  <div className="p-2.5 rounded-md bg-slate-50 border border-slate-100">
                    <p className="text-xs font-semibold text-slate-800">Deploy to Vercel production</p>
                    <span className="inline-block mt-2 text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium">Medium</span>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="rounded-lg bg-indigo-50/50 border border-indigo-200/80 p-3 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-indigo-100 text-xs font-bold text-indigo-900">
                    <span>IN PROGRESS</span>
                    <span className="bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded text-[10px]">1</span>
                  </div>
                  <div className="p-2.5 rounded-md bg-white border border-indigo-200 shadow-xs">
                    <p className="text-xs font-semibold text-slate-900">Build interactive Kanban board</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-medium">Urgent</span>
                      <span className="text-[10px] text-slate-400">Due in 2 days</span>
                    </div>
                  </div>
                </div>

                {/* Column 3 */}
                <div className="rounded-lg bg-white border border-slate-200 p-3 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs font-bold text-slate-700">
                    <span>DONE</span>
                    <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[10px]">3</span>
                  </div>
                  <div className="p-2.5 rounded-md bg-slate-50 border border-slate-100 mb-2 opacity-75">
                    <p className="text-xs font-semibold text-slate-600 line-through">Configure Prisma ORM</p>
                    <span className="inline-block mt-1 text-[10px] text-emerald-700 font-medium">Completed</span>
                  </div>
                  <div className="p-2.5 rounded-md bg-slate-50 border border-slate-100 opacity-75">
                    <p className="text-xs font-semibold text-slate-600 line-through">Jose JWT Authentication</p>
                    <span className="inline-block mt-1 text-[10px] text-emerald-700 font-medium">Completed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section id="features" className="py-20 sm:py-24 border-b border-slate-200/60 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Core Capabilities
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Engineered with full-stack craftsmanship.
            </p>
            <p className="mt-4 text-sm text-slate-600">
              Designed as a portfolio benchmark demonstrating clean architecture, resilient database operations, and high-quality UI/UX.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="p-3 rounded-xl bg-indigo-100 text-indigo-700 w-fit mb-4">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Interactive Kanban Boards</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Drag and drop tasks seamlessly across To Do, In Progress, and Done columns with instant server synchronization and accessible keyboard fallback.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700 w-fit mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Real-Time Velocity Analytics</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Recharts analytics visualizing task completion rates, status distributions, priority workloads, and project milestones calculated from live database records.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="p-3 rounded-xl bg-sky-100 text-sky-700 w-fit mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Strict Tenant Data Isolation</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Row-level database ownership enforcement ensures user accounts cannot view or mutate another user's projects or tasks under any circumstance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Explanation */}
      <section id="workflow" className="py-20 sm:py-24 border-b border-slate-200/60 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Straightforward Flow
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              From idea to deployment in 3 steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <span className="text-3xl font-black text-indigo-600">01</span>
              <h4 className="mt-4 text-base font-bold text-slate-900">Define Initiatives</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Create structured projects with custom color accents, due dates, priority tiers, and high-level milestones.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <span className="text-3xl font-black text-indigo-600">02</span>
              <h4 className="mt-4 text-base font-bold text-slate-900">Organize Tasks</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Break work down into actionable tasks. Filter by urgency, track status changes on the board, and assign deadlines.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <span className="text-3xl font-black text-indigo-600">03</span>
              <h4 className="mt-4 text-base font-bold text-slate-900">Measure Progress</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Review dynamic velocity metrics, monitor upcoming deadlines, and inspect the automated activity audit log.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Spec */}
      <section id="architecture" className="py-16 sm:py-20 bg-white border-b border-slate-200/60">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Technology Stack
          </h2>
          <p className="mt-2 text-2xl font-bold text-slate-900 tracking-tight sm:text-3xl">
            Modern, maintainable, production-ready.
          </p>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-xs font-bold text-indigo-600">Frontend</span>
              <p className="mt-1 font-semibold text-slate-900 text-sm">Next.js App Router</p>
              <p className="text-[11px] text-slate-500 mt-1">React 19, TypeScript, Tailwind CSS</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-xs font-bold text-indigo-600">Database</span>
              <p className="mt-1 font-semibold text-slate-900 text-sm">PostgreSQL & Prisma</p>
              <p className="text-[11px] text-slate-500 mt-1">Compound indexes & cascade deletes</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-xs font-bold text-indigo-600">Security</span>
              <p className="mt-1 font-semibold text-slate-900 text-sm">Jose & Bcrypt</p>
              <p className="text-[11px] text-slate-500 mt-1">HTTPOnly cookie JWT sessions</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-xs font-bold text-indigo-600">Validation</span>
              <p className="mt-1 font-semibold text-slate-900 text-sm">Zod Schemas</p>
              <p className="text-[11px] text-slate-500 mt-1">End-to-end type safety & sanitization</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-12 text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 text-white">
              <KanvoroLogoMark className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-white text-sm">Kanvoro</span>
            <span className="text-slate-500">| Portfolio SaaS Application</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link href="/register" className="hover:text-white transition-colors">Create Account</Link>
            <button onClick={handleDemoLogin} className="hover:text-white transition-colors cursor-pointer">
              Launch Demo
            </button>
          </div>

          <p className="text-slate-500">
            Built with Next.js, TypeScript, PostgreSQL, and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}
