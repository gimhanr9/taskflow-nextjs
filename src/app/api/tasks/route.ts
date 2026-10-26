import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { taskSchema } from "@/lib/validations";

// GET /api/tasks - list all tasks belonging to user with filters
export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const priority = searchParams.get("priority") || "";
    const projectId = searchParams.get("projectId") || "";
    const sort = searchParams.get("sort") || "order";

    const where: any = {
      userId: user.id, // Strict tenancy isolation
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (priority && priority !== "ALL") {
      where.priority = priority;
    }

    if (projectId && projectId !== "ALL") {
      where.projectId = projectId;
    }

    let orderBy: any = [{ order: "asc" }, { createdAt: "desc" }];
    if (sort === "due_soon") orderBy = [{ dueDate: "asc" }, { priority: "desc" }];
    if (sort === "priority") orderBy = [{ priority: "desc" }, { createdAt: "desc" }];
    if (sort === "newest") orderBy = { createdAt: "desc" };
    if (sort === "oldest") orderBy = { createdAt: "asc" };

    const tasks = await prisma.task.findMany({
      where,
      orderBy,
      include: {
        project: {
          select: {
            id: true,
            title: true,
            color: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("GET tasks error:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

// POST /api/tasks - create new task
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = taskSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id: data.projectId,
        userId: user.id,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Invalid project selected" }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        projectId: data.projectId,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        completedAt: data.status === "DONE" ? new Date() : null,
        userId: user.id,
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            color: true,
          },
        },
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "TASK_CREATED",
        details: `Created task "${task.title}" in project "${project.title}"`,
        entityType: "TASK",
        entityId: task.id,
        userId: user.id,
        projectId: project.id,
      },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("POST task error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
