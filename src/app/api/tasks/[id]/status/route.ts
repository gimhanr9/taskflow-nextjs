import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { taskStatusUpdateSchema } from "@/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH /api/tasks/[id]/status - quick status update / Kanban move
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const result = taskStatusUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { status, order } = result.data;

    // Verify task belongs to user
    const existing = await prisma.task.findFirst({
      where: { id, userId: user.id },
      include: { project: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const wasDone = existing.status === "DONE";
    const isNowDone = status === "DONE";

    let completedAt = existing.completedAt;
    if (isNowDone && !wasDone) {
      completedAt = new Date();
    } else if (!isNowDone && wasDone) {
      completedAt = null;
    }

    const updated = await prisma.task.update({
      where: { id },
      data: {
        status,
        ...(order !== undefined ? { order } : {}),
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

    // Format human-friendly status label
    const formatStatus = (s: string) => {
      if (s === "IN_PROGRESS") return "In Progress";
      if (s === "DONE") return "Done";
      return "Todo";
    };

    await prisma.activityLog.create({
      data: {
        action: isNowDone ? "TASK_COMPLETED" : "TASK_STATUS_CHANGED",
        details: isNowDone
          ? `Completed task "${updated.title}"`
          : `Moved task "${updated.title}" to ${formatStatus(status)}`,
        entityType: "TASK",
        entityId: updated.id,
        userId: user.id,
        projectId: existing.projectId,
      },
    });

    return NextResponse.json({ task: updated });
  } catch (error) {
    console.error("PATCH task status error:", error);
    return NextResponse.json({ error: "Failed to update task status" }, { status: 500 });
  }
}
