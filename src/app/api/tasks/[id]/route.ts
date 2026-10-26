import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { taskSchema } from "@/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/tasks/[id]
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const task = await prisma.task.findFirst({
      where: { id, userId: user.id },
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

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error("GET task by id error:", error);
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 });
  }
}

// PUT /api/tasks/[id]
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const result = taskSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    // Verify task belongs to user
    const existing = await prisma.task.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: { id: data.projectId, userId: user.id },
    });

    if (!project) {
      return NextResponse.json({ error: "Invalid project selected" }, { status: 400 });
    }

    const isNowDone = data.status === "DONE" && existing.status !== "DONE";
    const isNowNotDone = data.status !== "DONE" && existing.status === "DONE";

    let completedAt = existing.completedAt;
    if (isNowDone) completedAt = new Date();
    if (isNowNotDone) completedAt = null;

    const updated = await prisma.task.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        projectId: data.projectId,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        completedAt,
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
        action: "TASK_UPDATED",
        details: `Updated task "${updated.title}"`,
        entityType: "TASK",
        entityId: updated.id,
        userId: user.id,
        projectId: project.id,
      },
    });

    return NextResponse.json({ task: updated });
  } catch (error) {
    console.error("PUT task error:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

// DELETE /api/tasks/[id]
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.task.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    await prisma.task.delete({
      where: { id },
    });

    await prisma.activityLog.create({
      data: {
        action: "TASK_DELETED",
        details: `Deleted task "${existing.title}"`,
        entityType: "TASK",
        userId: user.id,
        projectId: existing.projectId,
      },
    });

    return NextResponse.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error("DELETE task error:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
