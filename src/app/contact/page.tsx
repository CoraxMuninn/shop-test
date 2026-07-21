"use client";

import React, { useState } from "react";
import { Instagram, Youtube, Send, Phone, Mail, MapPin, Clock, MessageSquare, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;
    setFormSubmitted(true);
    setName("");
    setPhone("");
    setMessage("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-right font-light" dir="rtl">
      
      {/* Page Header */}
      <div className="text-center mb-16">
        <span className="text-xs text-[#D9A8A0] tracking-widest font-semibold uppercase block">GET IN TOUCH</span>
        <h1 className="text-3xl sm:text-4xl font-light text-[#1A1A1A] mt-2 font-serif">تماس با دپارتمان پشتیبانی</h1>
        <div className="w-12 h-[1px] bg-[#D9A8A0] mx-auto mt-3"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
        
        {/* LEFT SIDE: Contact Form (Span 7) */}
        <div className="lg:col-span-7 bg-white border border-[#ECE7E3] p-6 sm:p-8 sharp-corners shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-[#1A1A1A] border-r-2 border-[#D9A8A0] pr-2">ارسال پیام مستقیم</h2>
          <p className="text-xs text-[#6F6F6F] leading-relaxed">
            سؤالات خود را درباره سایزبندی دقیق، متریال کارها یا وضعیت پیگیری مرسوله مطرح کنید. همکاران فنی ما در کمتر از ۲ ساعت کاری با شما تماس خواهند گرفت.
          </p>

          {formSubmitted ? (
            <div className="bg-green-50 border border-green-200 text-green-800 text-xs p-5 sharp-corners flex items-start gap-3 fade-in">
              <CheckCircle size={20} className="shrink-0 mt-0.5 text-green-600" />
              <div className="space-y-1.5">
                <span className="font-bold block">پیام شما با موفقیت ثبت گردید!</span>
                <p className="leading-relaxed">
                  از ارتباط شما صمیمانه سپاسگزاریم. پاسخ این مکاتبه به زودی از طریق پیامک یا تماس تلفنی توسط تیم روابط عمومی لباس زیر زنانه به اطلاع شما خواهد رسید.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1A1A1A]">نام و نام خانوادگی</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: سارا احمدی"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-3 border border-[#ECE7E3] outline-none bg-[#FAF8F6] focus:ring-1 focus:ring-[#D9A8A0] focus:bg-white sharp-corners"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1A1A1A]">شماره تلفن همراه</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: 09123456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs p-3 border border-[#ECE7E3] outline-none bg-[#FAF8F6] focus:ring-1 focus:ring-[#D9A8A0] focus:bg-white sharp-corners"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1A1A1A]">متن پیام شما</label>
                <textarea
                  required
                  rows={5}
                  placeholder="جزئیات درخواست یا ابهام سایز خود را به طور کامل بنویسید..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full text-xs p-3 border border-[#ECE7E3] outline-none bg-[#FAF8F6] focus:ring-1 focus:ring-[#D9A8A0] focus:bg-white sharp-corners"
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  className="bg-[#1A1A1A] text-white text-xs font-semibold px-8 py-3.5 sharp-corners hover:bg-[#D9A8A0] transition-colors cursor-pointer"
                >
                  ارسال پیام به پشتیبانی لوکس
                </button>
              </div>
            </form>
          )}
        </div>

        {/* RIGHT SIDE: Details & Image (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Details list */}
          <div className="bg-[#FAF8F6] border border-[#ECE7E3] p-6 sharp-corners space-y-5 text-xs text-[#1A1A1A]">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-[#D9A8A0] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">آدرس دفتر مرکزی و سالن دوخت:</span>
                <p className="text-[#6F6F6F] mt-1 leading-relaxed">
                  تهران، خیابان ولیعصر، بالاتر از میدان ونک، برج نگار، طبقه ۱۰، واحد پشتیبانی لباس زیر زنانه
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t border-[#ECE7E3] pt-4">
              <Phone size={18} className="text-[#D9A8A0] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">شماره تلفن‌های خط مستقیم:</span>
                <p className="text-[#6F6F6F] mt-1 font-mono">
                  ۰۲۱-۸۸۸۸۸۸۸۸ (۱۰ الی ۱۸)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t border-[#ECE7E3] pt-4">
              <Mail size={18} className="text-[#D9A8A0] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">مکاتبات رسمی پست الکترونیک:</span>
                <p className="text-[#6F6F6F] mt-1 font-mono">
                  support@lebaszirzanane.ir
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t border-[#ECE7E3] pt-4">
              <Clock size={18} className="text-[#D9A8A0] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">ساعات پاسخگویی واحد فروش:</span>
                <p className="text-[#6F6F6F] mt-1">
                  شنبه تا چهارشنبه: ۱۰ الی ۱۸ | پنج‌شنبه‌ها: ۱۰ الی ۱۴
                </p>
              </div>
            </div>
          </div>

          {/* AI generated luxury box image */}
          <div className="h-60 bg-gray-100 border border-[#ECE7E3]/30 overflow-hidden sharp-corners shadow-sm relative">
            <img
              src="/images/contact.jpg"
              alt="پشتیبانی مشتریان لبلس زیر"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>

    </div>
  );
}
