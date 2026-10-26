import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-3 text-indigo-600">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="text-sm font-semibold text-slate-700">Loading TaskFlow...</span>
      </div>
    </div>
  );
}
