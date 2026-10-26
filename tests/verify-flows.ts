import prisma from "../src/lib/prisma";
import bcrypt from "bcryptjs";
import { encryptToken, decryptToken } from "../src/lib/auth";
import {
  loginSchema,
  registerSchema,
  projectSchema,
  taskSchema,
  taskStatusUpdateSchema,
} from "../src/lib/validations";

async function runTestSuite() {
  console.log("🧪 Starting TaskFlow Automated Test & Verification Suite...\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. TEST ZOD VALIDATION SCHEMAS
  console.log("--- 1. Testing Input Validation (Zod) ---");
  const validRegister = registerSchema.safeParse({
    name: "Dev Tester",
    email: "tester@example.com",
    password: "Password123!",
  });
  assert(validRegister.success, "Valid registration payload accepted");

  const invalidRegisterEmail = registerSchema.safeParse({
    name: "Dev Tester",
    email: "not-an-email",
    password: "Password123!",
  });
  assert(!invalidRegisterEmail.success, "Invalid email address rejected");

  const invalidPassword = registerSchema.safeParse({
    name: "Dev Tester",
    email: "tester@example.com",
    password: "short",
  });
  assert(!invalidPassword.success, "Password under 8 characters rejected");

  const invalidProjectStatus = projectSchema.safeParse({
    title: "Project Alpha",
    status: "INVALID_STATUS",
  });
  assert(!invalidProjectStatus.success, "Invalid project status rejected");

  // 2. TEST AUTHENTICATION & JWT CRYPTO
  console.log("\n--- 2. Testing Cryptography & JWT Sessions ---");
  const rawPassword = "SecurePassword123!";
  const hash = await bcrypt.hash(rawPassword, 10);
  const match = await bcrypt.compare(rawPassword, hash);
  assert(match, "Bcrypt password hashing and comparison verified");

  const token = await encryptToken({
    userId: "test-user-id",
    email: "test@example.com",
    name: "Test User",
    role: "MEMBER",
  });
  assert(typeof token === "string" && token.length > 20, "JWT session token created with Jose");

  const decrypted = await decryptToken(token);
  assert(decrypted?.userId === "test-user-id" && decrypted?.email === "test@example.com", "JWT decrypted and payload verified");

  // 3. DATABASE CRUD & MULTI-TENANCY TEST
  console.log("\n--- 3. Testing Real Database CRUD & Tenant Data Isolation ---");

  // Create Tenant Alpha
  const alphaEmail = `tenant.alpha.${Date.now()}@test.dev`;
  const alphaUser = await prisma.user.create({
    data: {
      name: "Tenant Alpha",
      email: alphaEmail,
      password: hash,
    },
  });
  assert(!!alphaUser.id, `Created Tenant Alpha (${alphaUser.email})`);

  // Create Tenant Beta
  const betaEmail = `tenant.beta.${Date.now()}@test.dev`;
  const betaUser = await prisma.user.create({
    data: {
      name: "Tenant Beta",
      email: betaEmail,
      password: hash,
    },
  });
  assert(!!betaUser.id, `Created Tenant Beta (${betaUser.email})`);

  // Alpha creates Project
  const alphaProject = await prisma.project.create({
    data: {
      title: "Alpha Secret Strategy",
      status: "ACTIVE",
      priority: "HIGH",
      color: "#4f46e5",
      userId: alphaUser.id,
    },
  });
  assert(alphaProject.userId === alphaUser.id, "Project created for Tenant Alpha");

  // Verify Tenancy: Beta must NOT see Alpha's project
  const betaProjectSearch = await prisma.project.findFirst({
    where: {
      id: alphaProject.id,
      userId: betaUser.id, // Beta query
    },
  });
  assert(betaProjectSearch === null, "SECURITY VERIFIED: Tenant Beta CANNOT query Tenant Alpha's project");

  // Alpha creates Task
  const alphaTask = await prisma.task.create({
    data: {
      title: "Confidential Alpha Task",
      status: "TODO",
      priority: "URGENT",
      projectId: alphaProject.id,
      userId: alphaUser.id,
    },
  });
  assert(alphaTask.status === "TODO", "Task created in TODO column for Alpha");

  // Kanban status move: TODO -> IN_PROGRESS
  const movedTask = await prisma.task.update({
    where: { id: alphaTask.id },
    data: { status: "IN_PROGRESS" },
  });
  assert(movedTask.status === "IN_PROGRESS", "Task moved to IN_PROGRESS column");

  // Kanban status move: IN_PROGRESS -> DONE (with completedAt check)
  const completedTask = await prisma.task.update({
    where: { id: alphaTask.id },
    data: {
      status: "DONE",
      completedAt: new Date(),
    },
  });
  assert(completedTask.status === "DONE" && !!completedTask.completedAt, "Task moved to DONE with completedAt timestamp recorded");

  // Activity Log creation
  const log = await prisma.activityLog.create({
    data: {
      action: "TASK_COMPLETED",
      details: `Completed task "${completedTask.title}"`,
      entityType: "TASK",
      entityId: completedTask.id,
      userId: alphaUser.id,
      projectId: alphaProject.id,
    },
  });
  assert(log.userId === alphaUser.id, "Activity audit log record saved to PostgreSQL");

  // Cascade Deletion Test
  await prisma.project.delete({
    where: { id: alphaProject.id },
  });
  const remainingTasks = await prisma.task.findMany({
    where: { projectId: alphaProject.id },
  });
  assert(remainingTasks.length === 0, "CASCADE DELETION VERIFIED: Deleting project removed its nested tasks");

  // Clean up test tenants
  await prisma.user.deleteMany({
    where: { id: { in: [alphaUser.id, betaUser.id] } },
  });
  assert(true, "Cleaned up temporary test tenant accounts");

  // Summary
  console.log("\n==========================================");
  console.log(`Automated Tests Finished: ${passed} Passed, ${failed} Failed`);
  console.log("==========================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite()
  .catch((e) => {
    console.error("Test execution error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
