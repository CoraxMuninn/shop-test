import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ChevronRight, Calendar, BookOpen, User, Tag } from "lucide-react";

export const metadata = {
  title: "مجله مد و زیبایی لباس زیر زنانه - Lebaszirzanane",
  description: "آخرین مقالات، راهنماهای تخصصی انتخاب سایز، بهداشت لباس زیر، استایلینگ، روانشناسی رنگ‌ها و ترندهای لباس زیر زنانه لوکس.",
  alternates: {
    canonical: "https://lebaszirzanane.ir/blog",
  },
};

export default async function BlogPage() {
  // Fetch all published articles with categories
  const articles = await prisma.article.findMany({
    where: { publishStatus: "Published" },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  // Fetch all parent categories that have articles
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { sortOrder: "asc" },
  });

  const featuredArticle = articles[0];
  const listArticles = articles.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-right" dir="rtl">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-[#6F6F6F] mb-6 font-light">
        <Link href="/" className="hover:text-[#D9A8A0] transition-colors">خانه</Link>
        <ChevronRight size={12} className="rotate-180 text-gray-300" />
        <span className="text-[#1A1A1A]">مجله مد و زیبایی</span>
      </div>

      {/* Page Title */}
      <div className="mb-12 border-b border-[#ECE7E3] pb-6">
        <span className="text-xs text-[#D9A8A0] tracking-widest font-semibold uppercase block">THE EDITORIAL</span>
        <h1 className="text-3xl font-light text-[#1A1A1A] mt-2 font-serif">راهنمای استایل و دانشنامه بهداشت</h1>
        <p className="text-xs text-[#6F6F6F] mt-2 font-light max-w-xl">
          مجموعه مقالات علمی و ژورنالی درباره چگونگی اندازه‌گیری صحیح، نگهداری از پارچه‌های ظریف، بهداشت شخصی زنان، و افزایش اعتماد به نفس.
        </p>
      </div>

      {/* Category Badges Filter list */}
      <div className="flex flex-wrap gap-2.5 mb-10 pb-4 border-b border-[#ECE7E3]/40">
        <Link
          href="/blog"
          className="text-xs bg-[#1A1A1A] text-white px-4 py-2 sharp-corners font-semibold"
        >
          همه مقالات
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/blog/category/${cat.slug}`}
            className="text-xs bg-[#FAF8F6] text-[#1A1A1A] px-4 py-2 border border-[#ECE7E3] hover:border-[#D9A8A0] transition-colors sharp-corners"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {articles.length === 0 ? (
        <div className="py-24 text-center text-gray-500 bg-[#FAF8F6] border border-[#ECE7E3] sharp-corners">
          <BookOpen size={48} className="mx-auto text-gray-200 mb-3" />
          <p className="text-lg font-medium">هیچ مقاله‌ای یافت نشد</p>
        </div>
      ) : (
        <div className="space-y-16">
          {/* FEATURED MAIN ARTICLE (Hero style) */}
          {featuredArticle && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FAF8F6] border border-[#ECE7E3] p-6 sm:p-8 sharp-corners">
              {/* Image (Span 5) */}
              <div className="lg:col-span-6 h-80 sm:h-96 bg-gray-100 overflow-hidden sharp-corners relative">
                <img
                  src={featuredArticle.featuredImage}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-103"
                />
              </div>

              {/* Text info (Span 7) */}
              <div className="lg:col-span-6 flex flex-col space-y-4">
                <span className="inline-flex items-center gap-1 text-[10px] text-[#D9A8A0] font-semibold tracking-wider bg-white border border-[#ECE7E3] py-1 px-2.5 sharp-corners w-fit uppercase">
                  <Tag size={10} />
                  {featuredArticle.category.name}
                </span>

                <h2 className="text-xl sm:text-2xl lg:text-3xl font-light text-[#1A1A1A] leading-snug font-serif hover:text-[#D9A8A0] transition-colors">
                  <Link href={`/blog/${featuredArticle.slug}`}>
                    {featuredArticle.title}
                  </Link>
                </h2>

                <p className="text-xs sm:text-sm text-[#6F6F6F] leading-relaxed font-light">
                  {featuredArticle.excerpt}
                </p>

                <div className="flex items-center gap-4 text-[11px] text-[#6F6F6F] pt-2 border-t border-[#ECE7E3]/60 font-light">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(featuredArticle.createdAt).toLocaleDateString("fa-IR")}
                  </span>
                  <span className="flex items-center gap-1">
                    <User size={12} />
                    تحریریه لوکس
                  </span>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/blog/${featuredArticle.slug}`}
                    className="inline-flex items-center gap-1 bg-[#1A1A1A] text-white text-xs font-semibold px-6 py-3.5 sharp-corners hover:bg-[#D9A8A0] transition-colors"
                  >
                    مطالعه مقاله برگزیده
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* SECONDARY ARTICLES GRID */}
          {listArticles.length > 0 && (
            <div className="space-y-8">
              <h3 className="font-bold text-sm text-[#1A1A1A] border-b border-[#ECE7E3] pb-3 mb-6 font-serif">
                بیشتر بخوانید
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {listArticles.map((art) => (
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}
