import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { TasksClient } from "./TasksClient";

export default async function TasksPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [tasks, projects] = await Promise.all([
    prisma.task.findMany({
      where: { userId: user.id },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      include: {
        project: {
          select: { id: true, title: true, color: true },
        },
      },
    }),
    prisma.project.findMany({
      where: { userId: user.id },
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
  ]);

  return <TasksClient user={user} initialTasks={tasks} projects={projects} />;
}
