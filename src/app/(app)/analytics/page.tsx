import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { AnalyticsClient } from "./AnalyticsClient";

export default async function AnalyticsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [projects, tasks] = await Promise.all([
    prisma.project.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        tasks: {
          select: { id: true, status: true },
        },
      },
    }),
    prisma.task.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "DONE").length;
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const todoTasks = tasks.filter((t) => t.status === "TODO").length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Priority counts
  const lowCount = tasks.filter((t) => t.priority === "LOW").length;
  const mediumCount = tasks.filter((t) => t.priority === "MEDIUM").length;
  const highCount = tasks.filter((t) => t.priority === "HIGH").length;
  const urgentCount = tasks.filter((t) => t.priority === "URGENT").length;

  const priorityData = [
    { priority: "Low", count: lowCount, fill: "#94a3b8" },
    { priority: "Medium", count: mediumCount, fill: "#4f46e5" },
    { priority: "High", count: highCount, fill: "#f59e0b" },
    { priority: "Urgent", count: urgentCount, fill: "#e11d48" },
  ];

  // Status data
  const statusData = [
    { name: "To Do", value: todoTasks, color: "#94a3b8" },
    { name: "In Progress", value: inProgressTasks, color: "#4f46e5" },
    { name: "Done", value: completedTasks, color: "#10b981" },
  ];

  // 7-day velocity data
  const now = new Date();
  const velocityData: Array<{ date: string; completed: number; created: number }> = [];
  for (let i = 6; i >= 0; i--) {
    const targetDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dayStr = targetDate.toLocaleDateString("en-US", { weekday: "short", month: "numeric", day: "numeric" });
    const targetYMD = targetDate.toISOString().split("T")[0];

    const completedCount = tasks.filter((t) => {
      if (!t.completedAt) return false;
      return new Date(t.completedAt).toISOString().split("T")[0] === targetYMD;
    }).length;

    const createdCount = tasks.filter((t) => {
      return new Date(t.createdAt).toISOString().split("T")[0] === targetYMD;
    }).length;

    velocityData.push({
      date: dayStr,
      completed: completedCount,
      created: createdCount,
    });
  }

  // Projects progress
  const projectsProgress = projects.map((p) => {
    const pTotal = p.tasks.length;
    const pDone = p.tasks.filter((t) => t.status === "DONE").length;
    const progress = pTotal > 0 ? Math.round((pDone / pTotal) * 100) : 0;
    return {
      id: p.id,
      title: p.title,
      color: p.color,
      progress,
      totalTasks: pTotal,
      completedTasks: pDone,
    };
  });

  return (
    <AnalyticsClient
      user={user}
      stats={{
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        completionRate,
        totalProjects: projects.length,
      }}
      velocityData={velocityData}
      statusData={statusData}
      priorityData={priorityData}
      projects={projectsProgress}
    />
  );
}
