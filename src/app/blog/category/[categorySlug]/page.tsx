import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ChevronRight, Calendar, BookOpen, User } from "lucide-react";
import { notFound } from "next/navigation";

interface CategoryBlogProps {
  params: Promise<{
    categorySlug: string;
  }>;
}

export async function generateMetadata({ params }: CategoryBlogProps) {
  const resolvedParams = await params;
  const category = await prisma.category.findUnique({
    where: { slug: resolvedParams.categorySlug },
  });

  if (!category) return {};

  return {
    title: `مقالات و راهنمای خرید ${category.name} - لباس زیر زنانه Lebaszirzanane`,
    description: `مجموعه مقالات تخصصی، بهداشتی و استایلینگ در حوزه انتخاب و خرید انواع ${category.name} زنانه لوکس و استاندارد.`,
  };
}

export default async function CategoryBlogPage({ params }: CategoryBlogProps) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.categorySlug;

  // Find the category
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });

  if (!category) {
    notFound();
  }

  // Fetch articles belonging to this category or its subcategories
  const articles = await prisma.article.findMany({
    where: {
      categoryId: category.id,
      publishStatus: "Published",
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  // Fetch all parent categories for sidebar/nav
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-right" dir="rtl">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-[#6F6F6F] mb-6 font-light">
        <Link href="/" className="hover:text-[#D9A8A0] transition-colors">خانه</Link>
        <ChevronRight size={12} className="rotate-180 text-gray-300" />
        <Link href="/blog" className="hover:text-[#D9A8A0] transition-colors">مجله مد</Link>
        <ChevronRight size={12} className="rotate-180 text-gray-300" />
        <span className="text-[#1A1A1A]">مقالات {category.name}</span>
      </div>

      {/* Page Title */}
      <div className="mb-12 border-b border-[#ECE7E3] pb-6">
        <span className="text-xs text-[#D9A8A0] tracking-widest font-semibold uppercase block">THE EDITORIAL</span>
        <h1 className="text-3xl font-light text-[#1A1A1A] mt-2 font-serif">دانشنامه تخصصی: {category.name}</h1>
        <p className="text-xs text-[#6F6F6F] mt-2 font-light">
          مطالعه مقالات گلچین‌شده و علمی مرتبط با {category.name}؛ نوشته شده توسط متخصصین لباس خواب و بهداشت پوست زنانه.
        </p>
      </div>

      {/* Category Badges list */}
      <div className="flex flex-wrap gap-2.5 mb-10 pb-4 border-b border-[#ECE7E3]/40">
        <Link
          href="/blog"
          className="text-xs bg-[#FAF8F6] text-[#1A1A1A] px-4 py-2 border border-[#ECE7E3] hover:border-[#D9A8A0] transition-colors sharp-corners"
        >
          همه مقالات
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/blog/category/${cat.slug}`}
            className={`text-xs px-4 py-2 sharp-corners border transition-all ${
              category.id === cat.id
                ? "bg-[#1A1A1A] text-white border-transparent font-semibold"
                : "bg-[#FAF8F6] text-[#1A1A1A] border-[#ECE7E3] hover:border-[#D9A8A0]"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {articles.length === 0 ? (
        <div className="py-24 text-center text-gray-500 bg-[#FAF8F6] border border-[#ECE7E3] sharp-corners">
          <BookOpen size={48} className="mx-auto text-gray-200 mb-3" />
          <p className="text-lg font-medium">هیچ مقاله‌ای در این دسته‌بندی یافت نشد</p>
          <div className="mt-6">
            <Link
              href="/blog"
              className="bg-[#1A1A1A] text-white text-xs px-6 py-3 sharp-corners hover:bg-[#D9A8A0] transition-colors"
            >
              مشاهده کل آرشیو مجله
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art) => (
            <div
              key={art.id}
              className="group flex flex-col space-y-4 border border-[#ECE7E3]/40 p-4 bg-white hover:shadow-md transition-shadow sharp-corners"
            >
              <div className="h-56 bg-gray-100 overflow-hidden sharp-corners relative">
                <img
                  src={art.featuredImage}
                  alt={art.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-col space-y-2.5">
                <span className="text-[10px] text-[#D9A8A0] font-semibold tracking-wider uppercase">
                  {art.category.name}
                </span>
                <h4 className="font-medium text-sm text-[#1A1A1A] leading-snug truncate group-hover:text-[#D9A8A0] transition-colors">
                  <Link href={`/blog/${art.slug}`}>{art.title}</Link>
                </h4>
                <p className="text-xs text-[#6F6F6F] line-clamp-3 leading-relaxed font-light">
                  {art.excerpt}
                </p>
                <div className="flex items-center justify-between text-[10px] text-gray-400 pt-2 border-t border-gray-50">
                  <span className="font-mono">
                    {new Date(art.createdAt).toLocaleDateString("fa-IR")}
                  </span>
                  <Link
                    href={`/blog/${art.slug}`}
                    className="text-xs text-[#1A1A1A] group-hover:text-[#D9A8A0] font-semibold transition-colors flex items-center gap-1"
                  >
                    ادامه مطلب
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
