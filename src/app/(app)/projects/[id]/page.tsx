import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ProjectDetailClient } from "./ProjectDetailClient";

interface PageParams {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: PageParams) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;

  const project = await prisma.project.findFirst({
    where: { id, userId: user.id },
    include: {
      tasks: {
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      },
    },
  });

  if (!project) {
    notFound();
  }

  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter((t) => t.status === "DONE").length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <ProjectDetailClient
      user={user}
      project={{
        ...project,
        totalTasks,
        completedTasks,
        progress,
      }}
    />
  );
}
