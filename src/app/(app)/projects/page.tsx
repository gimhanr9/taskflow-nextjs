import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ProjectsClient } from "./ProjectsClient";

export default async function ProjectsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      tasks: {
        select: { id: true, status: true },
      },
    },
  });

  const formattedProjects = projects.map((p) => {
    const totalTasks = p.tasks.length;
    const completedTasks = p.tasks.filter((t) => t.status === "DONE").length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      id: p.id,
      title: p.title,
      description: p.description,
      status: p.status,
      priority: p.priority,
      color: p.color,
      startDate: p.startDate,
      dueDate: p.dueDate,
      createdAt: p.createdAt,
      totalTasks,
      completedTasks,
      progress,
    };
  });

  return <ProjectsClient user={user} initialProjects={formattedProjects} />;
}
