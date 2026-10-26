import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // Fetch real database records with strict user tenancy
  const [projects, tasks, activities] = await Promise.all([
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
      include: {
        project: {
          select: { id: true, title: true, color: true },
        },
      },
    }),
    prisma.activityLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  // Compute stats
  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "DONE").length;
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const todoTasks = tasks.filter((t) => t.status === "TODO").length;

  const now = new Date();
  const overdueTasks = tasks.filter(
    (t) => t.status !== "DONE" && t.dueDate && new Date(t.dueDate) < now
  ).length;

  // Projects with calculated progress
  const projectsWithProgress = projects.map((p) => {
    const pTotal = p.tasks.length;
    const pCompleted = p.tasks.filter((t) => t.status === "DONE").length;
    const progress = pTotal > 0 ? Math.round((pCompleted / pTotal) * 100) : 0;
    return {
      id: p.id,
      title: p.title,
      description: p.description,
      status: p.status,
      color: p.color,
      totalTasks: pTotal,
      completedTasks: pCompleted,
      progress,
      dueDate: p.dueDate,
    };
  });

  // Calculate 7-day velocity chart data
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

  // Status distribution data
  const statusDistribution = [
    { name: "To Do", value: todoTasks, color: "#94a3b8" },
    { name: "In Progress", value: inProgressTasks, color: "#4f46e5" },
    { name: "Done", value: completedTasks, color: "#10b981" },
  ];

  return (
    <DashboardClient
      user={user}
      stats={{
        totalProjects,
        totalTasks,
        completedTasks,
        overdueTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      }}
      velocityData={velocityData}
      statusDistribution={statusDistribution}
      recentProjects={projectsWithProgress}
      upcomingTasks={tasks.map((t) => ({
        id: t.id,
        title: t.title,
        priority: t.priority,
        dueDate: t.dueDate,
        status: t.status,
        project: t.project,
      }))}
      activities={activities.map((a) => ({
        id: a.id,
        action: a.action,
        details: a.details,
        entityType: a.entityType,
        createdAt: a.createdAt,
      }))}
      projectsList={projects.map((p) => ({ id: p.id, title: p.title }))}
    />
  );
}
