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
    const { items, address, discreetShipping, discountCodeId, discountAmount, totalAmount } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "سبد خرید شما خالی است" }, { status: 400 });
    }

    if (!address) {
      return NextResponse.json({ error: "لطفاً آدرس تحویل سفارش را انتخاب کنید" }, { status: 400 });
    }

    // Run order creation and stock decrement in a secure database transaction
    const createdOrder = await prisma.$transaction(async (tx) => {
      // 1. Double check stock for each item and decrement
      for (const item of items) {
        const dbProduct = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!dbProduct) {
          throw new Error(`محصول ${item.title} یافت نشد.`);
        }

        let variants = [];
        try {
          variants = JSON.parse(dbProduct.variants);
        } catch (e) {
          throw new Error("داده‌های انبار محصول معتبر نیست.");
        }

        // Find the color variant
        const colorVarIndex = variants.findIndex(
          (v: any) => v.colorName === item.color || v.color === item.color
        );

        if (colorVarIndex === -1) {
          throw new Error(`رنگ ${item.color} برای محصول ${item.title} یافت نشد.`);
        }

        // Find size variant inside color
        const sizeIndex = variants[colorVarIndex].sizes.findIndex(
          (s: any) => s.size === item.size
        );

        if (sizeIndex === -1) {
          throw new Error(`سایز ${item.size} برای رنگ ${item.color} یافت نشد.`);
        }

        const sizeObj = variants[colorVarIndex].sizes[sizeIndex];

        if (sizeObj.stock < item.quantity) {
          throw new Error(
            `موجودی سایز ${item.size} رنگ ${item.color} برای محصول ${item.title} کافی نیست. موجودی فعلی: ${sizeObj.stock} عدد`
          );
        }

        // Decrement stock
        variants[colorVarIndex].sizes[sizeIndex].stock -= item.quantity;

        // Save back updated product variants inside transaction
        await tx.product.update({
          where: { id: dbProduct.id },
          data: {
            variants: JSON.stringify(variants),
          },
        });
      }

      // 2. Increment discount usage count if used
      if (discountCodeId) {
        const code = await tx.discountCode.findUnique({
          where: { id: discountCodeId },
        });
        if (code) {
          await tx.discountCode.update({
            where: { id: discountCodeId },
            data: {
              timesUsed: { increment: 1 },
            },
          });
        }
      }

      // 3. Create Order
      const order = await tx.order.create({
        data: {
          userId,
          status: "Pending",
          shippingAddress: JSON.stringify(address),
          discreetShipping: !!discreetShipping,
          discountCodeId: discountCodeId || null,
          discountAmount: discountAmount || 0,
          totalAmount: totalAmount,
          paymentAuthority: `ZARIN_${Date.now()}`,
          paymentStatus: "Pending",
        },
      });

      // 4. Create OrderItems
      for (const item of items) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            productTitleSnapshot: item.title,
            color: item.color,
            size: item.size,
            unitPrice: item.price,
            quantity: item.quantity,
          },
        });
      }

      return order;
    });

    return NextResponse.json({
      success: true,
      orderId: createdOrder.id,
      authority: createdOrder.paymentAuthority,
    });
  } catch (error: any) {
    console.error("Order Create POST API transaction error:", error);
    return NextResponse.json(
      { error: error.message || "ثبت سفارش به دلیل بروز خطای همزمانی انبار ناموفق بود" },
      { status: 500 }
    );
  }
}
