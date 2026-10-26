import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { projectSchema } from "@/lib/validations";

// GET /api/projects - list all projects belonging to the logged-in user
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
    const sort = searchParams.get("sort") || "newest";

    const where: any = {
      userId: user.id,
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

    let orderBy: any = { createdAt: "desc" };
    if (sort === "oldest") orderBy = { createdAt: "asc" };
    if (sort === "due_soon") orderBy = { dueDate: "asc" };
    if (sort === "title") orderBy = { title: "asc" };

    const projects = await prisma.project.findMany({
      where,
      orderBy,
      include: {
        _count: {
          select: { tasks: true },
        },
        tasks: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    // Compute progress percentage for each project
    const projectsWithProgress = projects.map((p) => {
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
        updatedAt: p.updatedAt,
        totalTasks,
        completedTasks,
        progress,
      };
    });

    return NextResponse.json({ projects: projectsWithProgress });
  } catch (error) {
    console.error("GET projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// POST /api/projects - create new project
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = projectSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        color: data.color || "#4f46e5",
        startDate: data.startDate ? new Date(data.startDate) : null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        userId: user.id,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "PROJECT_CREATED",
        details: `Created project "${project.title}"`,
        entityType: "PROJECT",
        entityId: project.id,
        userId: user.id,
        projectId: project.id,
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("POST project error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
