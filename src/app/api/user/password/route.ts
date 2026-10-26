import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser, comparePassword, hashPassword } from "@/lib/auth";
import { passwordUpdateSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Safety for demo account
    if (user.email === "demo@taskflow.dev") {
      return NextResponse.json(
        { error: "Demo account password cannot be modified to preserve access for other reviewers." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const result = passwordUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = result.data;

    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!fullUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await comparePassword(currentPassword, fullUser.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
    }

    const hashed = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    await prisma.activityLog.create({
      data: {
        action: "PASSWORD_CHANGED",
        details: "Changed account password",
        entityType: "ACCOUNT",
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("POST password error:", error);
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }
}
