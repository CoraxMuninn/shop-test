import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, ShieldCheck, Heart, Truck, ShieldAlert, Award, Star, MessageSquare } from "lucide-react";

// Image and pricing helpers
function getProductMainImage(variantsStr: string): string {
  try {
    const vars = JSON.parse(variantsStr);
    if (vars?.[0]?.images?.[0]) return vars[0].images[0];
  } catch (e) {}
  return "/images/bra-luxury.jpg";
}

export default async function HomePage() {
  // Fetch live homepage data from database
  const newestProducts = await prisma.product.findMany({
    take: 4,
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  const bestSellingProducts = await prisma.product.findMany({
    take: 4,
    where: { published: true, featured: true },
    orderBy: { createdAt: "desc" },
  });

  const featuredArticles = await prisma.article.findMany({
    take: 3,
    where: { publishStatus: "Published" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[85vh] bg-[#FAF8F6] flex items-center overflow-hidden -mt-24">
        {/* Background Image with soft gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero.jpg"
            alt="کلکسیون لباس زیر لوکس"
            className="w-full h-full object-cover object-center opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-white/80 via-white/40 to-transparent"></div>
        </div>

        {/* Content Wrapper */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 relative flex justify-start">
          <div className="max-w-xl text-right flex flex-col space-y-6">
            <span className="text-[#D9A8A0] font-semibold tracking-widest text-xs uppercase">
              NEW SUMMER COLLECTION 2026
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light leading-tight tracking-wide text-[#1A1A1A] font-serif">
              راحتی لوکس،
              <br />
              زیبایی بی‌حد و مرز
            </h1>
            <p className="text-sm md:text-md text-[#6F6F6F] leading-relaxed font-light">
              آرامش و ظرافت به روایت برندهای تراز اول دنیا. دوخته شده با لطیف‌ترین پارچه‌های ابریشمی و گیپور ضدحساسیت فرانسوی، برای زنی که به کیفیت و حس سبکی خود اهمیت می‌دهد.
            </p>
            
            <div className="pt-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white px-8 py-4 text-xs font-semibold tracking-wider hover:bg-[#D9A8A0] transition-colors duration-300 sharp-corners"
              >
                شروع خرید کلکسیون جدید
                <ArrowLeft size={14} className="mr-1 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-light uppercase tracking-widest text-[#1A1A1A] font-serif">دسته‌بندی‌های لوکس</h2>
          <div className="w-12 h-[1px] bg-[#D9A8A0] mx-auto mt-2"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "سوتین‌های فنردار و گیپور", slug: "bras", image: "/images/bra-luxury.jpg", desc: "فرم‌دهی کاملا طبیعی" },
            { title: "شورت‌های نخی و فانتزی", slug: "panties", image: "/images/hero.jpg", desc: "پنبه ۱۰۰٪ ضدحساسیت" },
            { title: "ست‌های لباس زیر لوکس", slug: "lingerie-sets", image: "/images/set-lace.jpg", desc: "ظرافت و جذابیت اتاق خواب" },
            { title: "لباس‌های خواب ابریشمی", slug: "sleepwear", image: "/images/sleepwear-satin.jpg", desc: "ساتن لطیف درجه یک" },
          ].map((cat, idx) => (
            <Link
              href={`/shop/${cat.slug}`}
              key={idx}
              className="group relative h-96 bg-gray-100 overflow-hidden sharp-corners shadow-sm hover:shadow-md transition-shadow cursor-pointer block"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 text-right">
                <span className="text-[10px] text-[#D9A8A0] tracking-wider uppercase font-semibold">{cat.desc}</span>
                <h3 className="text-white font-medium text-lg mt-1 font-serif">{cat.title}</h3>
                <span className="text-[11px] text-gray-300 mt-2 inline-flex items-center gap-1 group-hover:text-white transition-colors">
                  مشاهده همه
                  <ArrowLeft size={12} className="group-hover:translate-x-[-4px] transition-transform duration-300" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. NEWEST PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-end mb-8 border-b border-[#ECE7E3] pb-4">
          <Link
            href="/shop?sort=newest"
            className="text-xs text-[#6F6F6F] hover:text-[#D9A8A0] transition-colors flex items-center gap-1"
          >
            مشاهده همه محصولات جدید
            <ArrowLeft size={12} />
          </Link>
          <div className="text-right">
            <span className="text-xs text-[#D9A8A0] tracking-widest font-semibold uppercase block">JUST ARRIVED</span>
            <h2 className="text-2xl font-light text-[#1A1A1A] font-serif">جدیدترین محصولات</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {newestProducts.map((p) => {
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
                  <div className="absolute top-3 right-3 bg-white text-[#1A1A1A] text-[10px] font-semibold px-2 py-1 sharp-corners">
                    جدید
                  </div>
                </div>
                <div className="text-right flex flex-col space-y-1">
                  <h3 className="font-light text-sm text-[#1A1A1A] truncate hover:text-[#D9A8A0] transition-colors">
                    {p.title}
                  </h3>
                  <div className="flex items-center justify-end gap-1.5 text-xs text-[#6F6F6F]">
                    <span className="text-[10px] font-medium text-yellow-500 flex items-center gap-0.5">
                      <Star size={11} fill="currentColor" />
                      ۴.۹
                    </span>
                    <span>|</span>
                    <span className="font-semibold text-[#1A1A1A]">
                      {p.basePrice.toLocaleString("fa-IR")} تومان
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. TRUST BOX / TRUST BADGES */}
      <section className="bg-[#FAF8F6] border-y border-[#ECE7E3] py-16 text-right w-full" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-white text-[#D9A8A0] border border-[#ECE7E3] sharp-corners">
                <ShieldCheck size={28} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <h3 className="font-bold text-md text-[#1A1A1A]">ضمانت بهداشتی ۷ روزه</h3>
                <p className="text-xs text-[#6F6F6F] leading-relaxed">
                  تضمین برگشت یا تعویض کالا در صورت استفاده نشدن، شسته نشدن، و دست نخوردن پلمپ بهداشتی؛ خریدی امن و با خیال کاملاً آسوده.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-white text-[#D9A8A0] border border-[#ECE7E3] sharp-corners">
                <Truck size={28} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <h3 className="font-bold text-md text-[#1A1A1A]">ارسال فوری و دیسکریت (محرمانه)</h3>
                <p className="text-xs text-[#6F6F6F] leading-relaxed">
                  بسته‌بندی‌ها کاملاً نود و بدون هولوگرام محصول بوده و هیچ نامی از لباس زیر روی جعبه قید نمی‌شود؛ حریم خصوصی شما خط قرمز ماست.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-white text-[#D9A8A0] border border-[#ECE7E3] sharp-corners">
                <ShieldAlert size={28} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <h3 className="font-bold text-md text-[#1A1A1A]">مهر تایید بهداشت و اصالت</h3>
                <p className="text-xs text-[#6F6F6F] leading-relaxed">
                  استفاده انحصاری از پنبه ارگانیک ضد باکتری و گیپورهای لطیف بدون هیچ‌گونه حساسیت‌زایی، برای محافظت کامل از سلامت بانوان.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BEST-SELLING PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-end mb-8 border-b border-[#ECE7E3] pb-4">
          <Link
            href="/shop?filter=featured"
            className="text-xs text-[#6F6F6F] hover:text-[#D9A8A0] transition-colors flex items-center gap-1"
          >
            مشاهده همه پرفروش‌ها
            <ArrowLeft size={12} />
          </Link>
          <div className="text-right">
            <span className="text-xs text-[#D9A8A0] tracking-widest font-semibold uppercase block">TOP SELLERS</span>
            <h2 className="text-2xl font-light text-[#1A1A1A] font-serif">محبوب‌ترین و پرفروش‌ترین‌ها</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {bestSellingProducts.map((p) => {
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
                  <div className="absolute top-3 right-3 bg-[#D9A8A0] text-white text-[10px] font-semibold px-2 py-1 sharp-corners">
                    محبوب
                  </div>
                </div>
                <div className="text-right flex flex-col space-y-1">
                  <h3 className="font-light text-sm text-[#1A1A1A] truncate hover:text-[#D9A8A0] transition-colors">
                    {p.title}
                  </h3>
                  <div className="flex items-center justify-end gap-1.5 text-xs text-[#6F6F6F]">
                    <span className="text-[10px] font-medium text-yellow-500 flex items-center gap-0.5">
                      <Star size={11} fill="currentColor" />
                      ۵.۰
                    </span>
                    <span>|</span>
                    <span className="font-semibold text-[#1A1A1A]">
                      {p.basePrice.toLocaleString("fa-IR")} تومان
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 6. STORE FEATURE HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full text-right" dir="rtl">
        {/* Fabric detail image */}
        <div className="bg-[#FAF8F6] h-[450px] overflow-hidden sharp-corners shadow-sm relative">
          <img
            src="/images/about.jpg"
            alt="دوخت لوکس لباس زیر زنانه"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Highlight content */}
        <div className="flex flex-col space-y-6">
          <span className="text-xs text-[#D9A8A0] tracking-widest font-semibold uppercase block">CRAFTSMANSHIP</span>
          <h2 className="text-3xl font-light text-[#1A1A1A] leading-snug font-serif">
            الهام گرفته از هنر اصیل ایتالیایی و مدرنیته مینیمال
          </h2>
          <p className="text-sm text-[#6F6F6F] leading-relaxed font-light">
            لباس زیر زنانه Lebaszirzanane تجسمی از تلفیق طرح‌های کلاسیک La Perla و خطوط مینیمال و ارگونومیک برند مدرن SKIMS است. ما معتقدیم اولین لایه از لباسی که هر روز بر تن می‌کنید، تعیین‌کننده حال روحی و میزان راحتی شما در تمام طول روز است.
          </p>
          <ul className="space-y-3.5 text-xs text-[#1A1A1A] font-light">
            <li className="flex items-center gap-2 justify-end">
              <span>طراحی مهندسی شده متناسب با ارگونومی و فیزیولوژی بدن خانم‌ها</span>
              <span className="w-1.5 h-1.5 bg-[#D9A8A0] rounded-full"></span>
            </li>
            <li className="flex items-center gap-2 justify-end">
              <span>دوخت دستی لبه‌ها جهت عدم تغییر شکل و افزایش طول عمر لباس لوکس</span>
              <span className="w-1.5 h-1.5 bg-[#D9A8A0] rounded-full"></span>
            </li>
            <li className="flex items-center gap-2 justify-end">
              <span>سایزبندی دقیق و علمی بر اساس استانداردهای بین‌المللی کاپ و بند</span>
              <span className="w-1.5 h-1.5 bg-[#D9A8A0] rounded-full"></span>
            </li>
          </ul>
        </div>
      </section>

      {/* 7. PROMOTIONAL BANNER */}
      <section className="bg-[#1A1A1A] text-white py-16 text-center relative overflow-hidden w-full">
        {/* Decorative thin overlay */}
        <div className="absolute inset-0 bg-[#D9A8A0]/5 z-0"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-5">
          <span className="text-[#D9A8A0] text-xs font-semibold tracking-widest uppercase">FIRST PURCHASE DISCOUNT</span>
          <h2 className="text-2xl sm:text-3xl font-light font-serif">تخفیف ویژه ورود به کلوب مشتریان لوکس</h2>
          <p className="text-xs sm:text-sm text-gray-300 font-light max-w-xl mx-auto leading-relaxed">
            با عضویت در سایت و ثبت اولین سفارش، از ۱۰٪ تخفیف روی کل سبد خرید خود با کد تخفیف <strong className="text-white font-mono tracking-wider bg-white/10 px-2 py-0.5 sharp-corners">WELCOME</strong> بهره‌مند شوید.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-block bg-white text-[#1A1A1A] font-bold text-xs px-8 py-3.5 sharp-corners hover:bg-[#D9A8A0] hover:text-white transition-colors duration-300"
            >
              همین حالا کد را فعال کنید
            </Link>
          </div>
        </div>
      </section>

      {/* 8. FEATURED ARTICLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-right" dir="rtl">
        <div className="text-center mb-10">
          <span className="text-xs text-[#D9A8A0] tracking-widest font-semibold uppercase block">THE EDITORIAL</span>
          <h2 className="text-2xl font-light text-[#1A1A1A] font-serif">مجله مد و مقالات خواندنی</h2>
          <div className="w-12 h-[1px] bg-[#D9A8A0] mx-auto mt-2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredArticles.map((art) => (
            <Link
              key={art.id}
              href={`/blog/${art.slug}`}
              className="group flex flex-col space-y-4 cursor-pointer"
            >
              <div className="h-60 bg-gray-100 overflow-hidden sharp-corners relative border border-[#ECE7E3]/20">
                <img
                  src={art.featuredImage}
                  alt={art.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <h3 className="font-medium text-md text-[#1A1A1A] leading-snug group-hover:text-[#D9A8A0] transition-colors truncate">
                  {art.title}
                </h3>
                <p className="text-xs text-[#6F6F6F] line-clamp-3 font-light leading-relaxed">
                  {art.excerpt}
                </p>
                <span className="text-xs text-[#1A1A1A] font-semibold flex items-center gap-1 mt-1 group-hover:text-[#D9A8A0] transition-colors">
                  مطالعه مقاله کامل
                  <ArrowLeft size={12} className="group-hover:translate-x-[-4px] transition-transform duration-300" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
