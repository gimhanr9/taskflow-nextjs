"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Runtime error caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 shadow-xs mb-6">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h1 className="text-2xl font-black text-slate-900 tracking-tight">Something went wrong</h1>
      <p className="text-xs text-slate-500 max-w-sm mt-2">
        An unexpected error occurred while processing this request. Our team has been notified.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => reset()}>
          <RefreshCcw className="w-4 h-4" />
          <span>Try Again</span>
        </Button>
        <Link href="/dashboard">
          <Button variant="primary" size="sm">
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
