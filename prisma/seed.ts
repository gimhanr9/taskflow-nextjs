import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting TaskFlow database seed...");

  // Clear existing data cleanly in reverse relationship order
  await prisma.activityLog.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const demoHashedPassword = await bcrypt.hash("TaskFlow123!", 10);
  const user2HashedPassword = await bcrypt.hash("Password123!", 10);

  const now = new Date();
  const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const daysFromNow = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  // 1. Create Demo User (Alex Chen)
  const demoUser = await prisma.user.create({
    data: {
      name: "Alex Chen",
      email: "demo@taskflow.dev",
      password: demoHashedPassword,
      role: "ADMIN",
      jobTitle: "Senior Full-Stack Architect",
      bio: "Building high-performance SaaS tools with Next.js, TypeScript, PostgreSQL, and clean UI engineering.",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  console.log(`👤 Created Demo User: ${demoUser.email}`);

  // Project 1: TaskFlow Core
  const project1 = await prisma.project.create({
    data: {
      title: "TaskFlow SaaS Platform",
      description: "Production-ready project management application with interactive Kanban boards, analytics, and tenant security.",
      status: "ACTIVE",
      priority: "HIGH",
      color: "#4f46e5", // Indigo
      startDate: daysAgo(14),
      dueDate: daysFromNow(10),
      userId: demoUser.id,
    },
  });

  // Project 2: Mobile Experience
  const project2 = await prisma.project.create({
    data: {
      title: "Mobile App Experience",
      description: "Touch-friendly responsive layouts, collapsible navigation drawers, and optimistic UI updates for mobile devices.",
      status: "ACTIVE",
      priority: "MEDIUM",
      color: "#0284c7", // Sky blue
      startDate: daysAgo(7),
      dueDate: daysFromNow(18),
      userId: demoUser.id,
    },
  });

  // Project 3: Cloud Infrastructure
  const project3 = await prisma.project.create({
    data: {
      title: "Cloud Infrastructure & CI/CD",
      description: "Automated GitHub Actions pipelines, multi-stage Docker containers, and PostgreSQL connection pooling.",
      status: "COMPLETED",
      priority: "URGENT",
      color: "#059669", // Emerald
      startDate: daysAgo(30),
      dueDate: daysAgo(2),
      userId: demoUser.id,
    },
  });

  // Project 4: Design System
  const project4 = await prisma.project.create({
    data: {
      title: "Design System & Micro-Interactions",
      description: "Accessible component tokens, keyboard focus rings, subtle shadows, and responsive data tables.",
      status: "PLANNING",
      priority: "LOW",
      color: "#d97706", // Amber
      startDate: daysFromNow(2),
      dueDate: daysFromNow(25),
      userId: demoUser.id,
    },
  });

  // Tasks for Project 1 (TaskFlow Core)
  await prisma.task.createMany({
    data: [
      {
        title: "Configure Prisma ORM and PostgreSQL schema",
        description: "Define User, Project, Task, and ActivityLog models with cascade deletions and compound indexes.",
        status: "DONE",
        priority: "HIGH",
        order: 0,
        dueDate: daysAgo(4),
        completedAt: daysAgo(3),
        projectId: project1.id,
        userId: demoUser.id,
      },
      {
        title: "Implement JWT session authentication with Jose",
        description: "Create HTTPOnly cookie session handlers, password hashing with bcrypt, and middleware route protection.",
        status: "DONE",
        priority: "HIGH",
        order: 1,
        dueDate: daysAgo(2),
        completedAt: daysAgo(1),
        projectId: project1.id,
        userId: demoUser.id,
      },
      {
        title: "Build responsive Kanban drag-and-drop board",
        description: "Support moving tasks between Todo, In Progress, and Done columns with instant server state persistence.",
        status: "IN_PROGRESS",
        priority: "HIGH",
        order: 0,
        dueDate: daysFromNow(3),
        projectId: project1.id,
        userId: demoUser.id,
      },
      {
        title: "Create Recharts analytics velocity charts",
        description: "Visualize task distribution by status, task priority metrics, and project completion velocities.",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        order: 1,
        dueDate: daysFromNow(5),
        projectId: project1.id,
        userId: demoUser.id,
      },
      {
        title: "Add keyboard navigation & accessibility focus rings",
        description: "Ensure full WCAG AA compliance with semantic buttons, escape key handlers, and screen reader labels.",
        status: "TODO",
        priority: "MEDIUM",
        order: 0,
        dueDate: daysFromNow(8),
        projectId: project1.id,
        userId: demoUser.id,
      },
      {
        title: "Draft comprehensive portfolio documentation",
        description: "Document system architecture, database schema, local setup, and production deployment instructions.",
        status: "TODO",
        priority: "LOW",
        order: 1,
        dueDate: daysFromNow(10),
        projectId: project1.id,
        userId: demoUser.id,
      },
    ],
  });

  // Tasks for Project 2 (Mobile Experience)
  await prisma.task.createMany({
    data: [
      {
        title: "Audit touch targets and swipe gestures",
        description: "Verify all clickable controls have minimum 44x44px hitboxes for mobile screens.",
        status: "DONE",
        priority: "LOW",
        order: 0,
        dueDate: daysAgo(1),
        completedAt: daysAgo(1),
        projectId: project2.id,
        userId: demoUser.id,
      },
      {
        title: "Implement responsive collapsible navigation drawer",
        description: "Ensure sidebar collapses seamlessly into a smooth overlay drawer on mobile viewports.",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        order: 0,
        dueDate: daysFromNow(4),
        projectId: project2.id,
        userId: demoUser.id,
      },
      {
        title: "Optimize offline cache and optimistic UI mutations",
        description: "Provide immediate UI feedback when toggling task status before network roundtrips finish.",
        status: "TODO",
        priority: "HIGH",
        order: 0,
        dueDate: daysFromNow(12),
        projectId: project2.id,
        userId: demoUser.id,
      },
    ],
  });

  // Tasks for Project 3 (Cloud Infrastructure - Completed)
  await prisma.task.createMany({
    data: [
      {
        title: "Set up Docker multi-stage build",
        description: "Minimize image size and optimize dependency layer caching for fast production builds.",
        status: "DONE",
        priority: "HIGH",
        order: 0,
        dueDate: daysAgo(15),
        completedAt: daysAgo(14),
        projectId: project3.id,
        userId: demoUser.id,
      },
      {
        title: "Configure PostgreSQL connection pooling",
        description: "Tune connection timeouts, max connections, and idle client cleanup for serverless workloads.",
        status: "DONE",
        priority: "URGENT",
        order: 1,
        dueDate: daysAgo(10),
        completedAt: daysAgo(8),
        projectId: project3.id,
        userId: demoUser.id,
      },
      {
        title: "Perform load testing for 10k concurrent requests",
        description: "Benchmark database latency and verify zero HTTP 5xx errors under heavy burst traffic.",
        status: "DONE",
        priority: "HIGH",
        order: 2,
        dueDate: daysAgo(4),
        completedAt: daysAgo(3),
        projectId: project3.id,
        userId: demoUser.id,
      },
    ],
  });

  // Tasks for Project 4 (Design System)
  await prisma.task.createMany({
    data: [
      {
        title: "Audit WCAG AA color contrast ratios",
        description: "Confirm all text and UI elements meet minimum 4.5:1 contrast ratio against subtle backgrounds.",
        status: "DONE",
        priority: "MEDIUM",
        order: 0,
        dueDate: daysAgo(2),
        completedAt: daysAgo(1),
        projectId: project4.id,
        userId: demoUser.id,
      },
      {
        title: "Design custom modal dialogs and toast alerts",
        description: "Implement clean notification components with zero layout shift.",
        status: "IN_PROGRESS",
        priority: "HIGH",
        order: 0,
        dueDate: daysFromNow(6),
        projectId: project4.id,
        userId: demoUser.id,
      },
      {
        title: "Implement theme tokens for subtle dark and light modes",
        description: "Curated slate and indigo palette tokens for elegant dark mode switching.",
        status: "TODO",
        priority: "LOW",
        order: 0,
        dueDate: daysFromNow(18),
        projectId: project4.id,
        userId: demoUser.id,
      },
    ],
  });

  // Activity logs for demo user
  await prisma.activityLog.createMany({
    data: [
      {
        action: "TASK_COMPLETED",
        details: "Completed task 'Implement JWT session authentication with Jose'",
        entityType: "TASK",
        userId: demoUser.id,
        projectId: project1.id,
        createdAt: daysAgo(1),
      },
      {
        action: "TASK_STATUS_CHANGED",
        details: "Moved 'Build responsive Kanban drag-and-drop board' to In Progress",
        entityType: "TASK",
        userId: demoUser.id,
        projectId: project1.id,
        createdAt: daysAgo(1),
      },
      {
        action: "PROJECT_CREATED",
        details: "Created new project 'TaskFlow SaaS Platform'",
        entityType: "PROJECT",
        userId: demoUser.id,
        projectId: project1.id,
        createdAt: daysAgo(14),
      },
      {
        action: "PROJECT_COMPLETED",
        details: "Marked project 'Cloud Infrastructure & CI/CD' as Completed",
        entityType: "PROJECT",
        userId: demoUser.id,
        projectId: project3.id,
        createdAt: daysAgo(2),
      },
    ],
  });

  // 2. Create Second User (Sarah Jenkins) for Tenancy Isolation
  const user2 = await prisma.user.create({
    data: {
      name: "Sarah Jenkins",
      email: "sarah.jenkins@example.com",
      password: user2HashedPassword,
      role: "MEMBER",
      jobTitle: "Operations Manager",
      bio: "Leading cross-functional logistics and enterprise billing integrations.",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
  });

  const sarahProject = await prisma.project.create({
    data: {
      title: "Fintech Billing Migration",
      description: "Confidential financial reporting and PCI-DSS compliance verification.",
      status: "ACTIVE",
      priority: "URGENT",
      color: "#dc2626", // Red
      startDate: daysAgo(5),
      dueDate: daysFromNow(15),
      userId: user2.id,
    },
  });

  await prisma.task.create({
    data: {
      title: "Audit Stripe webhook signatures",
      description: "Ensure zero replay attacks on payment webhook callbacks.",
      status: "IN_PROGRESS",
      priority: "URGENT",
      order: 0,
      dueDate: daysFromNow(2),
      projectId: sarahProject.id,
      userId: user2.id,
    },
  });

  console.log(`👤 Created Second User for isolation testing: ${user2.email}`);
  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
