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
    const { addressId } = await request.json();

    if (!addressId) {
      return NextResponse.json({ error: "شناسه آدرس الزامی است" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { addresses: true },
    });

    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    let savedAddresses = [];
    try {
      savedAddresses = JSON.parse(user.addresses || "[]");
    } catch (e) {}

    // Filter out the requested address to delete (IDOR protection: can only delete from own user row!)
    const updatedAddresses = savedAddresses.filter((a: any) => a.id !== addressId);

    await prisma.user.update({
      where: { id: userId },
      data: {
        addresses: JSON.stringify(updatedAddresses),
      },
    });

    return NextResponse.json({ success: true, addresses: updatedAddresses });
  } catch (error) {
    console.error("Addresses DELETE API error:", error);
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 });
  }
}
