import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Filter, SlidersHorizontal, ChevronRight, Star, Grid } from "lucide-react";

function getProductMainImage(variantsStr: string): string {
  try {
    const vars = JSON.parse(variantsStr);
    if (vars?.[0]?.images?.[0]) return vars[0].images[0];
  } catch (e) {}
  return "/images/bra-luxury.jpg";
}

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
    featured?: string;
  }>;
}

export default async function ShopPage({ searchParams }: PageProps) {
  // Await searchParams in Next.js 15+ App Router
  const params = await searchParams;
  const searchQuery = params.search || "";
  const categorySlug = params.category || "";
  const sort = params.sort || "newest";
  const onlyFeatured = params.featured === "true";

  // Fetch all categories for filter sidebar
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: { children: true },
  });

  // Build prisma query where clause
  const whereClause: any = {
    published: true,
  };

  // Filter by category if specified
  if (categorySlug) {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
      include: { children: true },
    });

    if (category) {
      // Find all IDs including child subcategories
      const catIds = [category.id, ...(category.children?.map((c) => c.id) || [])];
      whereClause.categoryId = { in: catIds };
    }
  }

  // Filter by search query if specified
  if (searchQuery) {
    // Basic search on title and description
    whereClause.OR = [
      { title: { contains: searchQuery } },
      { description: { contains: searchQuery } },
    ];
  }

  // Filter by featured
  if (onlyFeatured) {
    whereClause.featured = true;
  }

  // Define sort order
  let orderByClause: any = { createdAt: "desc" };
  if (sort === "price_asc") {
    orderByClause = { basePrice: "asc" };
  } else if (sort === "price_desc") {
    orderByClause = { basePrice: "desc" };
  } else if (sort === "featured") {
    orderByClause = { featured: "desc" };
  }

  // Fetch filtered products
  const products = await prisma.product.findMany({
    where: whereClause,
    orderBy: orderByClause,
    include: { category: true },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-right" dir="rtl">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-[#6F6F6F] mb-6 font-light">
        <Link href="/" className="hover:text-[#D9A8A0] transition-colors">خانه</Link>
        <ChevronRight size={12} className="rotate-180 text-gray-300" />
        <span className="text-[#1A1A1A]">فروشگاه لباس زیر</span>
        {categorySlug && (
          <>
            <ChevronRight size={12} className="rotate-180 text-gray-300" />
            <span className="text-[#D9A8A0]">
              {categorySlug === "bras" ? "سوتین" : categorySlug === "panties" ? "شورت" : categorySlug === "lingerie-sets" ? "ست لباس زیر" : categorySlug}
            </span>
          </>
        )}
      </div>

      {/* Page Title */}
      <div className="mb-10">
        <h1 className="text-3xl font-light text-[#1A1A1A] font-serif">
          {searchQuery ? `نتایج جستجو برای: "${searchQuery}"` : "کتابخانه محصولات لوکس"}
        </h1>
        <p className="text-xs text-[#6F6F6F] mt-2 font-light">
          شیک‌ترین، باکیفیت‌ترین و لطیف‌ترین البسه زیر زنانه متناسب با استانداردهای لوکس جهانی.
        </p>
      </div>

      {/* Grid Layout (Sidebar Filters + Products Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* RIGHT SIDE: Sidebar Filters (Sticky on desktop) */}
        <div className="lg:col-span-1 space-y-8 bg-[#FAF8F6] p-6 border border-[#ECE7E3] sharp-corners h-fit lg:sticky lg:top-36">
          <div className="flex items-center justify-between border-b border-[#ECE7E3] pb-3 mb-4">
            <h3 className="font-bold text-sm text-[#1A1A1A] flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-[#D9A8A0]" />
              فیلترهای پیشرفته
            </h3>
            {(categorySlug || searchQuery || sort !== "newest" || onlyFeatured) && (
              <Link
                href="/shop"
                className="text-[10px] text-[#D9A8A0] hover:underline"
              >
                پاک کردن همه
              </Link>
            )}
          </div>

          {/* Categories Filter */}
          <div>
            <h4 className="font-semibold text-xs text-[#1A1A1A] mb-3 border-r-2 border-[#D9A8A0] pr-2">دسته‌بندی‌ها</h4>
            <div className="space-y-2 flex flex-col text-xs font-light">
              <Link
                href="/shop"
                className={`hover:text-[#D9A8A0] transition-colors ${!categorySlug ? "font-bold text-[#D9A8A0]" : "text-[#6F6F6F]"}`}
              >
                همه دسته‌ها
              </Link>
              {categories.map((cat) => (
                <div key={cat.id} className="mr-2 flex flex-col gap-1.5 mt-1">
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className={`hover:text-[#D9A8A0] transition-colors ${categorySlug === cat.slug ? "font-bold text-[#D9A8A0]" : "text-[#6F6F6F]"}`}
                  >
                    {cat.name}
                  </Link>
                  {/* Render children subcategories */}
                  {cat.children && cat.children.length > 0 && (
                    <div className="mr-3 border-r border-[#ECE7E3] pr-2 space-y-1 mt-0.5 flex flex-col">
                      {cat.children.slice(0, 3).map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/shop?category=${sub.slug}`}
                          className={`hover:text-[#D9A8A0] transition-colors ${categorySlug === sub.slug ? "font-semibold text-[#D9A8A0]" : "text-gray-400"}`}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sorting Option */}
          <div>
            <h4 className="font-semibold text-xs text-[#1A1A1A] mb-3 border-r-2 border-[#D9A8A0] pr-2">مرتب‌سازی بر اساس</h4>
            <div className="space-y-2 flex flex-col text-xs font-light text-[#6F6F6F]">
              {[
                { label: "جدیدترین‌ها", val: "newest" },
                { label: "ارزان‌ترین به گران‌ترین", val: "price_asc" },
                { label: "گران‌ترین به ارزان‌ترین", val: "price_desc" },
                { label: "محصولات ویژه و محبوب", val: "featured" },
              ].map((opt) => (
                <Link
                  key={opt.val}
                  href={`/shop?${categorySlug ? `category=${categorySlug}&` : ""}${searchQuery ? `search=${searchQuery}&` : ""}sort=${opt.val}`}
                  className={`hover:text-[#D9A8A0] transition-colors ${sort === opt.val ? "font-bold text-[#D9A8A0]" : ""}`}
                >
                  {opt.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Featured Highlights Filter */}
          <div className="pt-2 border-t border-[#ECE7E3]">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-light text-[#1A1A1A]">
              <input
                type="checkbox"
                checked={onlyFeatured}
                onChange={() => {}}
                className="w-4 h-4 accent-[#D9A8A0] border-[#ECE7E3]"
                style={{ borderRadius: "0px" }}
              />
              <Link
                href={`/shop?${categorySlug ? `category=${categorySlug}&` : ""}${searchQuery ? `search=${searchQuery}&` : ""}sort=${sort}&featured=${!onlyFeatured}`}
                className="hover:text-[#D9A8A0] transition-colors"
              >
                نمایش فقط محصولات محبوب/ویژه
              </Link>
            </label>
          </div>
        </div>

        {/* LEFT SIDE: Products Grid */}
        <div className="lg:col-span-3">
          
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((p) => {
                const img = getProductMainImage(p.variants);
                return (
                  <Link
                    key={p.id}
                    href={`/product/${p.slug}`}
                    className="group flex flex-col space-y-3 cursor-pointer"
                  >
                    <div className="relative bg-[#FAF8F6] h-80 overflow-hidden sharp-corners border border-[#ECE7E3]/30">
                      <img
                        src={img}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {p.featured && (
                        <div className="absolute top-3 right-3 bg-[#D9A8A0] text-white text-[9px] font-bold px-2 py-0.5 sharp-corners">
                          ویژه
                        </div>
                      )}
                    </div>
                    <div className="text-right flex flex-col space-y-1">
                      <span className="text-[10px] text-[#6F6F6F] font-light">{p.category.name}</span>
                      <h3 className="font-light text-sm text-[#1A1A1A] truncate hover:text-[#D9A8A0] transition-colors">
                        {p.title}
                      </h3>
                      <div className="flex items-center justify-end gap-1.5 text-xs">
                        <span className="text-[10px] font-medium text-yellow-500 flex items-center gap-0.5">
                          <Star size={11} fill="currentColor" />
                          ۴.۹
                        </span>
                        <span className="text-gray-300">|</span>
                        <span className="font-semibold text-[#1A1A1A]">
                          {p.basePrice.toLocaleString("fa-IR")} تومان
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-24 text-center text-gray-500 bg-[#FAF8F6] border border-[#ECE7E3] sharp-corners">
              <Grid size={48} className="mx-auto text-gray-200 mb-3" />
              <p className="text-lg font-medium">هیچ محصولی در این فیلتر یافت نشد</p>
              <p className="text-sm text-gray-400 mt-1">فیلترهای دیگری را انتخاب کنید یا کلمه کلیدی را تغییر دهید.</p>
              <div className="mt-6">
                <Link
                  href="/shop"
                  className="bg-[#1A1A1A] text-white text-xs px-6 py-3 sharp-corners hover:bg-[#D9A8A0] transition-colors"
                >
                  نمایش همه محصولات
                </Link>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
