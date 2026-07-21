import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, authority, status } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: "شناسه سفارش ارسال نشده است" }, { status: 400 });
    }

    // Find the order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: "سفارش یافت نشد" }, { status: 404 });
    }

    // Double payment check safety
    if (order.status === "Paid") {
      return NextResponse.json({ success: true, message: "این سفارش از قبل پرداخت شده است", order });
    }

    if (status === "OK") {
      // Payment Successful: update order state
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "Paid",
          paymentStatus: "Paid",
          paymentRefId: `REF_${Math.floor(10000000 + Math.random() * 90000000)}`,
        },
      });

      return NextResponse.json({ success: true, message: "پرداخت با موفقیت انجام و تایید شد", order: updatedOrder });
    } else {
      // Payment Cancelled/Failed: update order state to Cancelled
      // AND RESTORE STOCK INVENTORY IN DATABASE
      await prisma.$transaction(async (tx) => {
        // Update Order to Cancelled
        await tx.order.update({
          where: { id: orderId },
          data: {
            status: "Cancelled",
            paymentStatus: "Failed",
          },
        });

        // Restore stock for each item back to product variants
        for (const item of order.items) {
          const dbProduct = await tx.product.findUnique({
            where: { id: item.productId },
          });

          if (!dbProduct) continue;

          let variants = [];
          try {
            variants = JSON.parse(dbProduct.variants);
          } catch (e) {
            continue;
          }

          const colorIdx = variants.findIndex(
            (v: any) => v.colorName === item.color || v.color === item.color
          );
          if (colorIdx === -1) continue;

          const sizeIdx = variants[colorIdx].sizes.findIndex(
            (s: any) => s.size === item.size
          );
          if (sizeIdx === -1) continue;

          // Increment stock back
          variants[colorIdx].sizes[sizeIdx].stock += item.quantity;

          // Save product
          await tx.product.update({
            where: { id: dbProduct.id },
            data: {
              variants: JSON.stringify(variants),
            },
          });
        }
      });

      return NextResponse.json({ success: false, error: "پرداخت متوقف گردید و موجودی محصولات به انبار بازگشت داده شد." });
    }
  } catch (error) {
    console.error("Order Verify API Error:", error);
    return NextResponse.json({ success: false, error: "بروز خطا در تایید تراکنش" }, { status: 500 });
  }
}
