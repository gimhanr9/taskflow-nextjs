import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "No date";
  const d = new Date(date);
  return format(d, "MMM d, yyyy");
}

export function formatRelativeDate(date: Date | string | null | undefined): string {
  if (!date) return "No date";
  const d = new Date(date);
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  if (isPast(d)) {
    return `${formatDistanceToNow(d)} ago`;
  }
  return `in ${formatDistanceToNow(d)}`;
}

export function getPriorityStyles(priority: string) {
  switch (priority.toUpperCase()) {
    case "URGENT":
      return {
        bg: "bg-rose-50 text-rose-700 border-rose-200",
        dot: "bg-rose-600",
        label: "Urgent",
      };
    case "HIGH":
      return {
        bg: "bg-amber-50 text-amber-700 border-amber-200",
        dot: "bg-amber-500",
        label: "High",
      };
    case "MEDIUM":
      return {
        bg: "bg-indigo-50 text-indigo-700 border-indigo-200",
        dot: "bg-indigo-500",
        label: "Medium",
      };
    case "LOW":
    default:
      return {
        bg: "bg-slate-100 text-slate-700 border-slate-200",
        dot: "bg-slate-400",
        label: "Low",
      };
  }
}

export function getStatusStyles(status: string) {
  switch (status.toUpperCase()) {
    case "DONE":
    case "COMPLETED":
      return {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dot: "bg-emerald-500",
        label: "Completed",
      };
    case "IN_PROGRESS":
    case "ACTIVE":
      return {
        bg: "bg-indigo-50 text-indigo-700 border-indigo-200",
        dot: "bg-indigo-600",
        label: status === "ACTIVE" ? "Active" : "In Progress",
      };
    case "PLANNING":
      return {
        bg: "bg-sky-50 text-sky-700 border-sky-200",
        dot: "bg-sky-500",
        label: "Planning",
      };
    case "ON_HOLD":
      return {
        bg: "bg-amber-50 text-amber-700 border-amber-200",
        dot: "bg-amber-500",
        label: "On Hold",
      };
    case "TODO":
    default:
      return {
        bg: "bg-slate-100 text-slate-700 border-slate-200",
        dot: "bg-slate-400",
        label: "Todo",
      };
  }
}
