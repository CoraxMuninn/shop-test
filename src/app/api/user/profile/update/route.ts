import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { name } = await request.json();

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "نام وارد شده نامعتبر است" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name.trim(),
      },
    });

    return NextResponse.json({ success: true, name: updatedUser.name });
  } catch (error) {
    console.error("Profile update API error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
