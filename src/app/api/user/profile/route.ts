import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { profileUpdateSchema } from "@/lib/validations";

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = profileUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, jobTitle, bio, avatarUrl } = result.data;

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        jobTitle,
        bio,
        avatarUrl: avatarUrl || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        jobTitle: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "PROFILE_UPDATED",
        details: "Updated account profile details",
        entityType: "ACCOUNT",
        userId: user.id,
      },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("PATCH profile error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
