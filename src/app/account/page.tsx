import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AccountClient from "./AccountClient";

export const metadata = {
  title: "حساب کاربری من - Lebaszirzanane | کلوپ مشتریان لوکس",
  description: "داشبورد اختصاصی مدیریت سفارش‌ها، آدرس‌ها، لیست علاقه‌مندی‌ها و پروفایل کاربری.",
};

export default async function AccountPage() {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session || !session.user || !(session.user as any).id) {
    redirect("/login?callbackUrl=/account");
  }

  const userId = (session.user as any).id;

  // Fetch complete user profile data live from database
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      phone: true,
      name: true,
      role: true,
      addresses: true,
      wishlistIds: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  // Fetch user orders with their respective line items
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: { slug: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch product wishlist details (resolve the string product IDs stored in JSON to full products!)
  let wishlistProducts: any[] = [];
  try {
    const parsedWishlistIds = JSON.parse(user.wishlistIds || "[]");
    if (parsedWishlistIds.length > 0) {
      wishlistProducts = await prisma.product.findMany({
        where: { id: { in: parsedWishlistIds } },
        include: { category: true },
      });
    }
  } catch (e) {
    console.error("Failed to parse or load wishlist products:", e);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" dir="rtl">
      <AccountClient
        user={JSON.parse(JSON.stringify(user))}
        orders={JSON.parse(JSON.stringify(orders))}
        wishlistProducts={JSON.parse(JSON.stringify(wishlistProducts))}
      />
    </div>
  );
}
