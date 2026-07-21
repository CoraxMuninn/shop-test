import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProductClient from "./ProductClient";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Fetch product from DB
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) {
    notFound();
  }

  // Fetch approved reviews
  const reviews = await prisma.review.findMany({
    where: {
      productId: product.id,
      moderationStatus: "Approved",
    },
    include: {
      user: {
        select: { name: true, phone: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch related products
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      NOT: { id: product.id },
      published: true,
    },
    take: 4,
    include: { category: true },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" dir="rtl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[#6F6F6F] mb-8 font-light text-right">
        <Link href="/" className="hover:text-[#D9A8A0] transition-colors">خانه</Link>
        <ChevronRight size={12} className="rotate-180 text-gray-300" />
        <Link href="/shop" className="hover:text-[#D9A8A0] transition-colors">فروشگاه</Link>
        <ChevronRight size={12} className="rotate-180 text-gray-300" />
        <Link href={`/shop?category=${product.category.slug}`} className="hover:text-[#D9A8A0] transition-colors">
          {product.category.name}
        </Link>
        <ChevronRight size={12} className="rotate-180 text-gray-300" />
        <span className="text-[#D9A8A0] truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Product Interactive Main Section */}
      <ProductClient
        product={JSON.parse(JSON.stringify(product))}
        reviews={JSON.parse(JSON.stringify(reviews))}
        relatedProducts={JSON.parse(JSON.stringify(relatedProducts))}
      />
    </div>
  );
}
