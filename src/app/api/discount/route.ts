import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code") || "";

    if (!code) {
      return NextResponse.json({ valid: false, error: "کد تخفیف معتبر نیست" }, { status: 400 });
    }

    const discount = await prisma.discountCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!discount) {
      return NextResponse.json({ valid: false, error: "کد تخفیف وارد شده وجود ندارد" });
    }

    if (!discount.isActive) {
      return NextResponse.json({ valid: false, error: "این کد تخفیف غیرفعال شده است" });
    }

    const now = new Date();
    if (discount.startsAt > now) {
      return NextResponse.json({ valid: false, error: "زمان شروع استفاده از این کد فرا نرسیده است" });
    }

    if (discount.expiresAt < now) {
      return NextResponse.json({ valid: false, error: "این کد تخفیف منقضی شده است" });
    }

    if (discount.timesUsed >= discount.usageLimit) {
      return NextResponse.json({ valid: false, error: "سقف استفاده از این کد تخفیف به پایان رسیده است" });
    }

    return NextResponse.json({
      valid: true,
      id: discount.id,
      code: discount.code,
      type: discount.type,
      value: discount.value,
    });
  } catch (error) {
    console.error("Discount check API Error:", error);
    return NextResponse.json({ valid: false, error: "خطا در بررسی کد تخفیف" }, { status: 500 });
  }
}
