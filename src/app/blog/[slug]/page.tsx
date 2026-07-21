import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ChevronRight, Calendar, User, BookOpen, Clock, Tag } from "lucide-react";

interface ArticleSlugProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ArticleSlugProps) {
  const resolvedParams = await params;
  const article = await prisma.article.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!article) return {};

  return {
    title: `${article.metaTitle || article.title} | مجله لباس زیر زنانه`,
    description: article.metaDescription || article.excerpt,
    alternates: {
      canonical: article.canonicalUrl || `https://lebaszirzanane.ir/blog/${article.slug}`,
    },
    robots: {
      index: article.indexStatus,
      follow: article.indexStatus,
    },
  };
}

// Simple heading extractor to generate Table of Contents dynamically!
function extractHeadings(content: string) {
  const headingRegex = /<h([2-3])\s*(?:id="([^"]*)")?[^>]*>(.*?)<\/h\1>/g;
  const headings: { level: number; id: string; text: string }[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = parseInt(match[1]);
    const text = match[3].replace(/<[^>]*>/g, ""); // Strip nested tags if any
    
    // Generate an ID if not present
    let id = match[2] || `heading-${headings.length}`;
    headings.push({ level, id, text });
  }

  return headings;
}

export default async function ArticleDetailPage({ params }: ArticleSlugProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const article = await prisma.article.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!article) {
    notFound();
  }

  // Generate Table of Contents
  const headings = extractHeadings(article.content);

  // Fetch some related articles
  const relatedArticles = await prisma.article.findMany({
    where: {
      categoryId: article.categoryId,
      NOT: { id: article.id },
      publishStatus: "Published",
    },
    take: 2,
  });

  // Structured Data (JSON-LD) for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.excerpt,
    "image": `https://lebaszirzanane.ir${article.featuredImage}`,
    "datePublished": article.createdAt.toISOString(),
    "dateModified": article.updatedAt.toISOString(),
    "author": {
      "@type": "Organization",
      "name": "Lebaszirzanane Editorial",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Lebaszirzanane",
      "logo": {
        "@type": "ImageObject",
        "url": "https://lebaszirzanane.ir/images/hero.jpg",
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://lebaszirzanane.ir/blog/${article.slug}`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "خانه",
        "item": "https://lebaszirzanane.ir",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "مجله مد",
        "item": "https://lebaszirzanane.ir/blog",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title,
        "item": `https://lebaszirzanane.ir/blog/${article.slug}`,
      },
    ],
  };

  return (
    <>
      {/* Inject Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-right font-light" dir="rtl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-[#6F6F6F] mb-8 font-light">
          <Link href="/" className="hover:text-[#D9A8A0] transition-colors">خانه</Link>
          <ChevronRight size={12} className="rotate-180 text-gray-300" />
          <Link href="/blog" className="hover:text-[#D9A8A0] transition-colors">مجله مد</Link>
          <ChevronRight size={12} className="rotate-180 text-gray-300" />
          <Link href={`/blog/category/${article.category.slug}`} className="hover:text-[#D9A8A0] transition-colors">
            {article.category.name}
          </Link>
          <ChevronRight size={12} className="rotate-180 text-gray-300" />
          <span className="text-[#D9A8A0] truncate max-w-xs">{article.title}</span>
        </nav>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* RIGHT SIDE: Main Content Panel (Span 8) */}
          <article className="lg:col-span-8 bg-white border border-[#ECE7E3] p-6 sm:p-8 sharp-corners shadow-sm space-y-6">
            <span className="inline-flex items-center gap-1 text-[10px] text-[#D9A8A0] font-semibold tracking-wider bg-[#FAF8F6] border border-[#ECE7E3] py-1 px-2.5 sharp-corners uppercase">
              <Tag size={10} />
              {article.category.name}
            </span>

            <h1 className="text-2xl sm:text-3xl font-light text-[#1A1A1A] font-serif leading-snug">
              {article.title}
            </h1>

            {/* Author meta and stats */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#6F6F6F] border-y border-[#ECE7E3]/60 py-3.5 font-light">
              <span className="flex items-center gap-1">
                <Calendar size={13} />
                تاریخ انتشار: {new Date(article.createdAt).toLocaleDateString("fa-IR")}
              </span>
              <span className="flex items-center gap-1">
                <User size={13} />
                نویسنده: کادر دپارتمان بهداشت و مد
              </span>
              <span className="flex items-center gap-1">
                <Clock size={13} />
                زمان مطالعه: ۶ دقیقه
              </span>
            </div>

            {/* Featured Image */}
            <div className="h-96 sm:h-[450px] bg-gray-100 overflow-hidden sharp-corners relative">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Render article body */}
            <div
              className="prose max-w-none prose-neutral text-justify text-xs sm:text-sm leading-relaxed text-[#1A1A1A] space-y-5"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </article>

          {/* LEFT SIDE: Dynamic TOC Sidebar & Related (Span 4) */}
          <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-36 h-fit">
            
            {/* Table of Contents Box */}
            {headings.length > 0 && (
              <div className="border border-[#ECE7E3] bg-[#FAF8F6] p-6 sharp-corners">
                <h3 className="font-bold text-xs sm:text-sm text-[#1A1A1A] border-b border-[#ECE7E3] pb-2.5 mb-4 flex items-center gap-2">
                  <BookOpen size={16} className="text-[#D9A8A0]" />
                  فهرست مطالب مقاله
                </h3>
                <nav className="flex flex-col gap-2.5 text-xs text-[#6F6F6F]">
                  {headings.map((h, idx) => (
                    <a
                      key={idx}
                      href={`#${h.id}`}
                      className={`hover:text-[#D9A8A0] transition-colors leading-relaxed block ${
                        h.level === 3 ? "mr-4 border-r border-[#ECE7E3] pr-2 text-gray-400 font-normal" : "font-medium"
                      }`}
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Quick 7-Day return promo banner inside sidebar */}
            <div className="border border-[#ECE7E3] p-6 sharp-corners bg-[#1A1A1A] text-white text-right space-y-4">
              <span className="text-[10px] text-[#D9A8A0] font-bold tracking-widest block">LUXURY PACKAGING</span>
              <h4 className="font-bold text-sm leading-snug">رعایت حریم شخصی و ارسال دیسکریت</h4>
              <p className="text-[10px] text-gray-300 leading-normal">
                تمامی سفارشات شما بدون نام محصول و در پاکت‌های فاقد برند ارسال می‌شوند تا با خیال آسوده بتوانید خرید لوکس خود را انجام دهید.
              </p>
              <Link
                href="/privacy"
                className="inline-block text-[11px] text-[#D9A8A0] font-bold hover:underline"
              >
                مطالعه تعهدات حریم خصوصی
              </Link>
            </div>

            {/* Related Articles inside sidebar */}
            {relatedArticles.length > 0 && (
              <div className="border border-[#ECE7E3] p-6 sharp-corners bg-white space-y-4">
                <h3 className="font-bold text-xs sm:text-sm text-[#1A1A1A] border-b border-[#ECE7E3] pb-2.5">
                  مقالات مرتبط دیگر
                </h3>
                <div className="space-y-4">
                  {relatedArticles.map((art) => (
                    <Link
                      key={art.id}
                      href={`/blog/${art.slug}`}
                      className="group flex gap-3 text-xs items-center cursor-pointer"
                    >
                      <img src={art.featuredImage} alt="" className="w-12 h-12 object-cover sharp-corners bg-gray-50" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-[#1A1A1A] truncate group-hover:text-[#D9A8A0] transition-colors">
                          {art.title}
                        </h4>
                        <p className="text-[10px] text-gray-400 mt-1 font-mono">
                          {new Date(art.createdAt).toLocaleDateString("fa-IR")}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>

        </div>
      </div>
    </>
  );
}
