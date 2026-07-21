"use client";

import React from "react";
import Link from "next/link";
import { Instagram, Youtube, Send, ShieldCheck, Truck, RefreshCw, Award } from "lucide-react";

export default function Footer() {
  const currentYearPersian = "۱۴۰۵"; // Statically matching our today's date of 2026 (1405 SH)

  return (
    <footer className="bg-[#FAF8F6] border-t border-[#ECE7E3] text-[#1A1A1A] pt-16 pb-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Benefits / Trust Badges (Trust Box) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-[#ECE7E3] text-center">
          <div className="flex flex-col items-center">
            <ShieldCheck size={36} className="text-[#D9A8A0] mb-3" />
            <h4 className="font-semibold text-sm">تضمین ۱۰۰٪ اصالت و کیفیت</h4>
            <p className="text-xs text-[#6F6F6F] mt-1">تضمین متریال ضدحساسیت و لوکس</p>
          </div>
          <div className="flex flex-col items-center">
            <RefreshCw size={36} className="text-[#D9A8A0] mb-3" />
            <h4 className="font-semibold text-sm">۷ روز ضمانت بازگشت</h4>
            <p className="text-xs text-[#6F6F6F] mt-1">بازگشت و تعویض بی‌قید و شرط کالا</p>
          </div>
          <div className="flex flex-col items-center">
            <Truck size={36} className="text-[#D9A8A0] mb-3" />
            <h4 className="font-semibold text-sm">ارسال کاملاً محرمانه</h4>
            <p className="text-xs text-[#6F6F6F] mt-1">بسته‌بندی بدون نام محصول و برند</p>
          </div>
          <div className="flex flex-col items-center">
            <Award size={36} className="text-[#D9A8A0] mb-3" />
            <h4 className="font-semibold text-sm">پشتیبانی مقتدرانه ۲۴ ساعته</h4>
            <p className="text-xs text-[#6F6F6F] mt-1">پاسخگویی سریع در تلگرام و اینستاگرام</p>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12 text-right">
          {/* Column 1: Brand Intro */}
          <div className="space-y-4">
            <div className="flex flex-col items-start">
              <span className="font-bold text-lg tracking-widest uppercase font-serif">
                LEBASZIRZANANE
              </span>
              <span className="text-[9px] tracking-[3px] text-[#D9A8A0] font-light -mt-1 block">
                LUXURY LINGERIE
              </span>
            </div>
            <p className="text-xs text-[#6F6F6F] leading-relaxed">
              پلتفرم تخصصی لباس زیر زنانه لوکس و مدرن؛ ارائه دهنده برترین و ظریف‌ترین سوتین‌ها، شورت‌ها، ست‌های فانتزی و لباس خواب الهام گرفته از برندهای بزرگ جهانی همچون SKIMS و La Perla متناسب با سلیقه بانوان شیک‌پسند ایرانی.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-[#D9A8A0] transition-colors" aria-label="اینستاگرام">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#D9A8A0] transition-colors" aria-label="یوتیوب">
                <Youtube size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#D9A8A0] transition-colors" aria-label="تلگرام">
                <Send size={18} className="-rotate-45" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-semibold text-sm border-r-2 border-[#D9A8A0] pr-2 mb-4">دسترسی سریع</h4>
            <ul className="space-y-2.5 text-xs font-light flex flex-col">
              <li>
                <Link href="/shop" className="text-[#6F6F6F] hover:text-[#D9A8A0] transition-colors">فروشگاه لباس زیر</Link>
              </li>
              <li>
                <Link href="/blog" className="text-[#6F6F6F] hover:text-[#D9A8A0] transition-colors">مقالات و راهنمای استایل</Link>
              </li>
              <li>
                <Link href="/about" className="text-[#6F6F6F] hover:text-[#D9A8A0] transition-colors">درباره ما</Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#6F6F6F] hover:text-[#D9A8A0] transition-colors">تماس با ما</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Policy Links */}
          <div>
            <h4 className="font-semibold text-sm border-r-2 border-[#D9A8A0] pr-2 mb-4">راهنمای مشتریان</h4>
            <ul className="space-y-2.5 text-xs font-light flex flex-col">
              <li>
                <Link href="/privacy" className="text-[#6F6F6F] hover:text-[#D9A8A0] transition-colors">سیاست حریم خصوصی</Link>
              </li>
              <li>
                <Link href="/privacy#return" className="text-[#6F6F6F] hover:text-[#D9A8A0] transition-colors">قوانین ۷ روز بازگشت کالا</Link>
              </li>
              <li>
                <Link href="/privacy#discreet" className="text-[#6F6F6F] hover:text-[#D9A8A0] transition-colors">ارسال کاملاً محرمانه و دیسکریت</Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#6F6F6F] hover:text-[#D9A8A0] transition-colors">روش‌های پیگیری سفارش</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust Seal & Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm border-r-2 border-[#D9A8A0] pr-2 mb-4 font-serif">نشانی و تماس</h4>
            <p className="text-xs text-[#6F6F6F] leading-relaxed font-light">
              تهران، میدان ونک، برج نگار، طبقه ۱۰، واحد پشتیبانی لباس زیر زنانه
              <br />
              تلفن پشتیبانی: ۰۲۱-۸۸۸۸۸۸۸۸
              <br />
              ایمیل: support@lebaszirzanane.ir
            </p>
            {/* Trust Seals representation */}
            <div className="flex gap-2 pt-2">
              <div className="w-16 h-16 bg-white border border-[#ECE7E3] p-1 flex items-center justify-center sharp-corners">
                <span className="text-[10px] text-gray-400 font-bold text-center leading-3 uppercase font-mono">e-Namad approved</span>
              </div>
              <div className="w-16 h-16 bg-white border border-[#ECE7E3] p-1 flex items-center justify-center sharp-corners">
                <span className="text-[10px] text-gray-400 font-bold text-center leading-3 uppercase font-mono">Samandehi certified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom copyright */}
        <div className="border-t border-[#ECE7E3] pt-8 mt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-[#6F6F6F] font-light">
          <p>© {currentYearPersian} لبلس زیر زنانه (Lebaszirzanane). تمامی حقوق محفوظ است.</p>
          <p className="mt-2 sm:mt-0">طراحی شده با عشق جهت حفظ حس زیبایی و راحتی شما</p>
        </div>
      </div>
    </footer>
  );
}
