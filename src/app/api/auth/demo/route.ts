import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createSession, hashPassword } from "@/lib/auth";

export async function POST() {
  try {
    let demoUser = await prisma.user.findUnique({
      where: { email: "demo@taskflow.dev" },
    });

    if (!demoUser) {
      // Auto-provision demo user if database was fresh
      const hashedPassword = await hashPassword("TaskFlow123!");
      demoUser = await prisma.user.create({
        data: {
          name: "Alex Chen",
          email: "demo@taskflow.dev",
          password: hashedPassword,
          role: "ADMIN",
          jobTitle: "Senior Full-Stack Architect",
          bio: "Building high-performance SaaS tools with Next.js, TypeScript, PostgreSQL, and clean UI engineering.",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        },
      });
    }

    await createSession(demoUser);

    return NextResponse.json({
      success: true,
      user: {
        id: demoUser.id,
        name: demoUser.name,
        email: demoUser.email,
        jobTitle: demoUser.jobTitle,
      },
    });
  } catch (error) {
    console.error("Demo login error:", error);
    return NextResponse.json({ error: "Failed to initialize demo session" }, { status: 500 });
  }
}
