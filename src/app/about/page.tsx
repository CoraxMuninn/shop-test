import React from "react";
import Link from "next/link";
import { ArrowLeft, Award, Sparkles, Heart, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "درباره ما - Lebaszirzanane | اصالت، راحتی و زیبایی مدرن",
  description: "داستان شکل‌گیری برند لباس زیر زنانه Lebaszirzanane؛ تولید تخصصی البسه زیر لوکس با الهام از برترین برندهای مینیمال و کلاسیک دنیا.",
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-right font-light" dir="rtl">
      
      {/* Page Header */}
      <div className="text-center mb-16">
        <span className="text-xs text-[#D9A8A0] tracking-widest font-semibold uppercase block">OUR STORY</span>
        <h1 className="text-3xl sm:text-4xl font-light text-[#1A1A1A] mt-2 font-serif">داستان برند لوکس ما</h1>
        <div className="w-12 h-[1px] bg-[#D9A8A0] mx-auto mt-3"></div>
      </div>

      {/* Main Grid: Story Content + Image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
        
        {/* Story Text (Span 7) */}
        <div className="lg:col-span-7 space-y-6 text-sm sm:text-base leading-relaxed text-justify text-[#1A1A1A]">
          <h2 className="text-xl sm:text-2xl font-light text-[#1A1A1A] font-serif leading-snug">
            چگونه حس راحتی و لوکس بودن را با لایه‌های پنهان لباس بازتعریف کردیم؟
          </h2>
          <p>
            برند تخصصی لباس زیر زنانه <strong className="font-semibold text-[#D9A8A0]">Lebaszirzanane</strong> با یک ایده ساده اما بنیادین شکل گرفت: هر زن شایسته آن است که در اولین لایه از پوششی که هر روز انتخاب می‌کند، اوج راحتی، بهداشت، سبکی و زیبایی فریبنده را تجربه کند. ایده شکل‌گیری کلوپ ما ناشی از تماشای یک خلاء عمیق در بازار پوشاک زیر ایران بود؛ جایی که معمولاً محصولات میان طرح‌های زبر پلاستیکی غیربهداشتی یا کارهای بدون قالب ارگونومیک محبوس مانده بودند.
          </p>
          <p>
            ما با الگوبرداری دقیق از خطوط تولید ارگونومیک و مینیمال برند نوآور جهانی <strong className="font-medium text-[#1A1A1A]">SKIMS</strong> و تلفیق هنرمندانه آن با الگوهای فریبنده، توری و پرجزئیات اصیل فرانسوی و ایتالیایی <strong className="font-medium text-[#1A1A1A]">La Perla</strong>، کلکسیون‌هایی را آفریدیم که نه تنها زیبایی طبیعی اندام زنانه را برجسته می‌سازند، بلکه حس اعتماد به نفس بی‌نظیری را از درونی‌ترین لایه بدن به جریان می‌اندازند.
          </p>
          <p>
            متریال به کار رفته در محصولات ما، حاصل ماه‌ها بررسی میکروسکوپی و تست‌های مکرر آزمایشگاهی است. استفاده انحصاری از پنبه ارگانیک فوق شانه شده، گیپورهای لطیف و تارهای کشسانی اولترا استرچ که هیچ اثری بر پوست و شانه به جای نمی‌گذارند، عهد همیشگی تیم ما با سلامت و کیفیت البسه شماست.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white px-6 py-3.5 text-xs font-semibold hover:bg-[#D9A8A0] transition-colors sharp-corners"
            >
              مشاهده کلکسیون محصولات لوکس
              <ArrowLeft size={14} className="rotate-180" />
            </Link>
          </div>
        </div>

        {/* Story Image (Span 5) */}
        <div className="lg:col-span-5 h-[480px] bg-[#FAF8F6] border border-[#ECE7E3]/40 sharp-corners overflow-hidden shadow-md">
          <img
            src="/images/about.jpg"
            alt="داستان برند لباس زیر زنانه"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>

      </div>

      {/* Brand Values boxes */}
      <section className="bg-[#FAF8F6] border border-[#ECE7E3] p-8 sm:p-12 sharp-corners mb-20 space-y-10">
        <div className="text-center">
          <span className="text-xs text-[#D9A8A0] tracking-widest font-semibold uppercase block">OUR CORE VALUES</span>
          <h2 className="text-xl sm:text-2xl font-light text-[#1A1A1A] font-serif">ارزش‌های تغییرناپذیر ما</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-right">
          <div className="space-y-3">
            <div className="w-10 h-10 bg-white border border-[#ECE7E3] text-[#D9A8A0] flex items-center justify-center sharp-corners mx-auto sm:mr-0">
              <Award size={20} />
            </div>
            <h3 className="font-semibold text-sm text-[#1A1A1A]">کیفیت بی‌مصالحه</h3>
            <p className="text-xs text-[#6F6F6F] leading-relaxed">
              ما هیچ‌گاه سلامت پوست شما را فدای قیمت ارزان‌تر نخ‌های نایلونی نخواهیم کرد. تمامی محصولات ما مستقیماً تحت بازرسی‌های مکرر بهداشتی قرار می‌گیرند.
            </p>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 bg-white border border-[#ECE7E3] text-[#D9A8A0] flex items-center justify-center sharp-corners mx-auto sm:mr-0">
              <Heart size={20} />
            </div>
            <h3 className="font-semibold text-sm text-[#1A1A1A]">تطبیق جامع با بدن زنانه</h3>
            <p className="text-xs text-[#6F6F6F] leading-relaxed">
              ما معتقدیم البسه زیر باید قالب اندام زنانه باشد، نه آنکه بدن خود را به زور در لباس قرار دهد. به همین دلیل ما سیستم اندازه‌گیری کاپ و بند دقیق را پیاده‌سازی کردیم.
            </p>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 bg-white border border-[#ECE7E3] text-[#D9A8A0] flex items-center justify-center sharp-corners mx-auto sm:mr-0">
              <Sparkles size={20} />
            </div>
            <h3 className="font-semibold text-sm text-[#1A1A1A]">تجربه خرید آسان و محرمانه</h3>
            <p className="text-xs text-[#6F6F6F] leading-relaxed">
              حفظ حریم شخصی، دیسکریت بودن فرآیند تحویل و پاسخگویی سریع پشتیبانان ما، اصولی اساسی در تجربه خرید بی‌اصطکاک مشتریان ما می‌باشد.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
