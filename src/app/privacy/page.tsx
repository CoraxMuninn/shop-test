import React from "react";
import { ShieldCheck, RotateCcw, Truck, Lock, AlertCircle } from "lucide-react";

export const metadata = {
  title: "حریم خصوصی و قوانین بازگشت کالا - Lebaszirzanane",
  description: "ضمانت ۷ روز بازگشت بهداشتی مرسوله، قوانین ارسال محرمانه دیسکریت، و سیاست‌های حریم شخصی کاربران لباس زیر زنانه.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-right font-light leading-relaxed text-[#1A1A1A]" dir="rtl">
      
      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-xs text-[#D9A8A0] tracking-widest font-semibold uppercase block">POLICIES & SAFETY</span>
        <h1 className="text-3xl font-light text-[#1A1A1A] mt-2 font-serif">حریم خصوصی و تعهدات فروشگاه</h1>
        <div className="w-12 h-[1px] bg-[#D9A8A0] mx-auto mt-3"></div>
      </div>

      {/* Featured AI Image */}
      <div className="h-80 bg-[#FAF8F6] border border-[#ECE7E3]/40 overflow-hidden sharp-corners mb-12 shadow-sm relative">
        <img
          src="/images/privacy.jpg"
          alt="قوانین محرمانه و بهداشت کالا"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* 1. Return and Exchange Policy (Section 17) */}
      <section id="return" className="mb-12 space-y-4">
        <h2 className="text-xl font-light font-serif text-[#1A1A1A] border-b border-[#ECE7E3] pb-2 flex items-center gap-2">
          <RotateCcw size={20} className="text-[#D9A8A0]" />
          قوانین ۷ روز ضمانت بازگشت و تعویض کالا
        </h2>
        <p className="text-xs sm:text-sm text-[#6F6F6F]">
          به دلیل ماهیت کاملاً بهداشتی دسته لباس زیر زنانه (سوتین، شورت، ست‌های فانتزی و بادی)، رعایت سخت‌گیرانه پروتکل‌های بهداشتی وزارت بهداشت جهت حفظ سلامت تمام بانوان عزیز الزامی است. با این وجود، جهت ثبت خریدی امن و با رضایت کامل، تعهد کلوپ ما برای مرجوعی کالا به شرح زیر است:
        </p>
        <ul className="list-disc pr-6 space-y-2 text-xs sm:text-sm text-[#1A1A1A]">
          <li><strong>مهلت اعلام بازگشت:</strong> خریدار محترم حق دارد تا حداکثر <strong className="text-[#D9A8A0]">۷ روز</strong> پس از دریافت مرسوله درب منزل، درخواست مرجوعی یا تعویض سایز خود را به پشتیبانی اعلام نماید.</li>
          <li><strong>شرایط فیزیکی کار:</strong> کالا باید کاملاً بکر، پوشیده نشده، شسته نشده، بدون بوی عطر یا بدن، و فاقد هرگونه چروک و آسیب در بافت توری کار باشد.</li>
          <li><strong>پلمپ بهداشتی:</strong> شورت‌ها و ست‌های فانتزی دارای پچ و پلمپ محافظ بهداشتی چسبیده در فاق کار هستند؛ تعویض یا مرجوعی کالا تنها و تنها در صورتی مقدور است که این چسب بهداشتی جدا، کنده یا دستکاری نشده باشد.</li>
          <li><strong>فرآیند بازگشت وجه:</strong> پس از تایید واحد ارزیابی بهداشت انبار، مبلغ کالای بازگشتی حداکثر طی ۴۸ ساعت کاری از طریق سیستم عودت وجه زرین‌پال به حساب بانکی شخص خریدار واریز خواهد شد.</li>
        </ul>
      </section>

      {/* 2. Order Privacy & Discreet Shipping Policy (Section 18) */}
      <section id="discreet" className="mb-12 space-y-4">
        <h2 className="text-xl font-light font-serif text-[#1A1A1A] border-b border-[#ECE7E3] pb-2 flex items-center gap-2">
          <Truck size={20} className="text-[#D9A8A0]" />
          ارسال دیسکریت و بسته‌بندی کاملاً محرمانه
        </h2>
        <p className="text-xs sm:text-sm text-[#6F6F6F] leading-relaxed">
          ما درک می‌کنیم که البسه شخصی فانتزی و خواب جزو خصوصی‌ترین خریدهای هر فرد است. یکی از ارکان و اصول کلیدی برند ما، پایبندی تمام‌قد به حریم شخصی مشتریان است:
        </p>
        <ul className="list-disc pr-6 space-y-2 text-xs sm:text-sm text-[#1A1A1A]">
          <li><strong>جعبه و پاکت بیرون:</strong> کلیه مرسولات ارسالی در پوشش جعبه‌ای محکم کرافت قهوه‌ای یا پاکت نود ضخیم تیره مات قرار می‌گیرند. هیچگونه برچسب تجاری، کلمه «لباس زیر»، عکس محصول یا لوگوی به خصوصی که نشان‌دهنده محتویات درون بسته باشد روی جعبه چسبانده نخواهد شد.</li>
          <li><strong>اطلاعیه پیامکی:</strong> کلیه پیامک‌های رهگیری و ثبت سفارش فاقد کلمات حساس مربوط به نوع البسه بوده و تنها حاوی متن عمومی «سفارش شما با موفقیت صادر شد» می‌باشند.</li>
          <li><strong>فاکتور چاپی محرمانه:</strong> در صورتی که در برگه نهایی فاکتور گزینه «فاکتور محرمانه» را انتخاب کنید، تمام اقلام فاکتور با عنوان عمومی «پوشاک یا البسه معمولی زنانه» چاپ و تعبیه خواهد شد تا حریم خصوصی شما نزد پیک‌ها، پست‌چی یا اعضای خانواده کاملاً محفوظ بماند.</li>
        </ul>
      </section>

      {/* 3. Secure and Data Handling Policy */}
      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-light font-serif text-[#1A1A1A] border-b border-[#ECE7E3] pb-2 flex items-center gap-2">
          <Lock size={20} className="text-[#D9A8A0]" />
          امنیت داده‌ها و قوانین حریم شخصی
        </h2>
        <p className="text-xs sm:text-sm text-[#6F6F6F] leading-relaxed">
          شماره تلفن همراه شما، آدرس ثبت شده، و سبد خریدهای شما به عنوان حساس‌ترین اسرار تجاری کلوپ ما تلقی شده و به صورت تمام رمزگذاری شده در سرورهای ما نگهداری می‌شوند. ما متعهد می‌شویم این داده‌ها را به هیچ نهاد، سازمان ثالث یا شرکت‌های تبلیغاتی منتقل نخواهیم کرد. سیستم ورود بدون رمز عبور پیامکی (OTP) با انقضای کوتاه مدت، مانع از دسترسی هرگونه هکر یا شخص ثالث به تاریخچه خرید شما می‌شود.
        </p>
      </section>

      <div className="bg-[#FAF8F6] border border-[#ECE7E3] p-4 sharp-corners text-xs flex gap-2 items-center text-[#6F6F6F]">
        <AlertCircle size={16} className="text-[#D9A8A0] shrink-0" />
        <span>قوانین فوق به عنوان یک سند حقوقی فیمابین فروشگاه و کاربر تلقی شده و ثبت هرگونه سفارش به معنای تایید و قبولی کلیه مفاد فوق می‌باشد.</span>
      </div>

    </div>
  );
}
