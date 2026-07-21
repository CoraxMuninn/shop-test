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
    const body = await request.json();
    const { title, receiver, phone, province, city, address, postalCode } = body;

    // Validate inputs
    if (!title || !receiver || !phone || !province || !city || !address || !postalCode) {
      return NextResponse.json({ error: "تمام فیلدهای آدرس اجباری هستند" }, { status: 400 });
    }

    // Retrieve current user addresses
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

    // Add new address
    const newAddress = {
      id: `addr_${Date.now()}`,
      title,
      receiver,
      phone,
      province,
      city,
      address,
      postalCode,
    };

    savedAddresses.push(newAddress);

    // Save back to DB
    await prisma.user.update({
      where: { id: userId },
      data: {
        addresses: JSON.stringify(savedAddresses),
      },
    });

    return NextResponse.json({ success: true, addresses: savedAddresses });
  } catch (error) {
    console.error("Addresses POST API error:", error);
    return NextResponse.json({ error: "Failed to save address" }, { status: 500 });
  }
}
