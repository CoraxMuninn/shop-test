import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminClient from "./AdminClient";

export const metadata = {
  title: "پنل مدیریت لوکس - Lebaszirzanane",
  description: "پنل جامع مدیریت محصولات، مقالات، سفارش‌ها، کوپن‌های تخفیف و نظرات کاربران.",
};

export default async function AdminDashboardPage() {
  const session = await auth();

  // Route security: block access for non-admins
  if (!session || !session.user || (session.user as any).role !== "Admin") {
    redirect("/login?callbackUrl=/admin");
  }

  // Fetch all necessary data for administrative operations in parallel
  const [products, categories, orders, articles, reviews, discountCodes, users] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { children: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.order.findMany({
      include: { items: true, user: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.article.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.review.findMany({
      include: { user: true, product: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.discountCode.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50/50 py-10" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminClient
          initialProducts={JSON.parse(JSON.stringify(products))}
          initialCategories={JSON.parse(JSON.stringify(categories))}
          initialOrders={JSON.parse(JSON.stringify(orders))}
          initialArticles={JSON.parse(JSON.stringify(articles))}
          initialReviews={JSON.parse(JSON.stringify(reviews))}
          initialDiscountCodes={JSON.parse(JSON.stringify(discountCodes))}
          initialUsers={JSON.parse(JSON.stringify(users))}
        />
      </div>
    </div>
  );
}
