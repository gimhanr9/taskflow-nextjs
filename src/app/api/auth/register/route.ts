import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password, jobTitle } = result.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        jobTitle: jobTitle || "Product Builder",
      },
    });

    // Create sample welcome project and task for onboarding!
    const welcomeProject = await prisma.project.create({
      data: {
        title: "Getting Started with TaskFlow",
        description: "Welcome! Here is your first workspace to explore tasks, progress tracking, and project planning.",
        status: "ACTIVE",
        priority: "MEDIUM",
        color: "#4f46e5",
        userId: newUser.id,
      },
    });

    await prisma.task.createMany({
      data: [
        {
          title: "Explore the Kanban board",
          description: "Drag and drop tasks across columns or use the status menu.",
          status: "TODO",
          priority: "HIGH",
          order: 0,
          projectId: welcomeProject.id,
          userId: newUser.id,
        },
        {
          title: "Create your first project",
          description: "Click 'New Project' in the projects section to organize your work.",
          status: "IN_PROGRESS",
          priority: "MEDIUM",
          order: 0,
          projectId: welcomeProject.id,
          userId: newUser.id,
        },
      ],
    });

    await prisma.activityLog.create({
      data: {
        action: "ACCOUNT_CREATED",
        details: "Created TaskFlow account",
        entityType: "ACCOUNT",
        userId: newUser.id,
      },
    });

    // Establish session cookie
    await createSession(newUser);

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        jobTitle: newUser.jobTitle,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
