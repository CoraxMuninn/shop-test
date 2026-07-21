"use client";

import React, { useState, useEffect, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Phone, Lock, ArrowLeft, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";

function LoginInner() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: input phone, 2: input otp
  const [timer, setTimer] = useState(120);
  const [timerActive, setTimerActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      router.push(callbackUrl);
    }
  }, [session, router, callbackUrl]);

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setTimerActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");

    // Iranian phone regex
    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setErrorMessage("لطفاً یک شماره موبایل معتبر ۱۱ رقمی (مثلاً ۰۹۱۲۳۴۵۶۷۸۹) وارد کنید.");
      return;
    }

    setLoading(true);

    // Simulate sending OTP SMS
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      setTimer(120);
      setTimerActive(true);
      setInfoMessage(`کد تایید پیامکی شبیه‌سازی‌شده با موفقیت به شماره ${phone} ارسال گردید. برای ورود آزمایشی از کد ۱۲۳۴۵۶ استفاده فرمایید.`);
    }, 800);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    if (otp.length !== 6) {
      setErrorMessage("کد تایید باید ۶ رقمی باشد.");
      setLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        phone,
        otp,
        redirect: false,
      });

      if (res?.error) {
        setErrorMessage("کد تایید وارد شده اشتباه یا منقضی شده است. کد پیش‌فرض تستی ۱۲۳۴۵۶ می‌باشد.");
        setLoading(false);
      } else {
        // Success: Redirect
        router.push(callbackUrl);
      }
    } catch (err) {
      setErrorMessage("خطایی در تایید کد به وجود آمد. مجدداً تلاش کنید.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-right" dir="rtl">
      <div className="bg-white border border-[#ECE7E3] p-8 sharp-corners shadow-xl space-y-8 relative">
        {/* Brand Header */}
        <div className="text-center">
          <span className="font-bold text-2xl tracking-widest uppercase font-serif block">
            LEBASZIRZANANE
          </span>
          <span className="text-[9px] tracking-[4px] text-[#D9A8A0] font-light -mt-1 block">
            SECURE PORTAL
          </span>
          <h2 className="text-sm font-semibold text-[#1A1A1A] mt-6">ورود سریع پیامکی (بدون رمز عبور)</h2>
          <p className="text-[11px] text-[#6F6F6F] mt-1 font-light leading-relaxed">
            تنها با وارد کردن شماره همراه خود، بلافاصله وارد کلوپ لوکس لبلس زیر زنانه شوید.
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="bg-red-50 text-red-700 text-xs p-3.5 sharp-corners border border-red-200 flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Info Notification */}
        {infoMessage && (
          <div className="bg-blue-50 text-blue-800 text-xs p-3.5 sharp-corners border border-blue-200 flex items-start gap-2 leading-relaxed">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#D9A8A0]" />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* Step 1: Input Phone */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1A1A1A] block">شماره تلفن همراه</label>
              <div className="relative border border-[#ECE7E3] sharp-corners flex items-center bg-[#FAF8F6]">
                <span className="px-3 text-xs text-gray-400 font-mono select-none">IR</span>
                <input
                  type="text"
                  maxLength={11}
                  placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full text-sm py-3 px-3 border-none outline-none bg-transparent text-right font-mono tracking-wider placeholder-gray-400 focus:ring-0"
                  disabled={loading}
                />
                <Phone size={16} className="text-gray-400 ml-3" />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !phone}
                className="w-full bg-[#1A1A1A] text-white py-3.5 text-xs font-semibold hover:bg-[#D9A8A0] transition-colors sharp-corners flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-300"
              >
                {loading ? "در حال شبیه‌سازی..." : "دریافت کد تایید یکبار مصرف"}
                <ArrowLeft size={14} className="rotate-180 mr-1" />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Input OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1A1A1A] block">کد تایید ۶ رقمی</label>
              <div className="relative border border-[#ECE7E3] sharp-corners flex items-center bg-[#FAF8F6]">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="کد تایید تستی: ۱۲۳۴۵۶"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full text-center text-sm py-3 px-3 border-none outline-none bg-transparent font-mono tracking-[8px] placeholder-gray-400 focus:ring-0"
                  disabled={loading}
                />
                <Lock size={16} className="text-gray-400 ml-3" />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-[#1A1A1A] text-white py-3.5 text-xs font-semibold hover:bg-[#D9A8A0] transition-colors sharp-corners flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-300"
              >
                {loading ? "در حال تایید..." : "تایید کد و ورود"}
              </button>
            </div>

            <div className="flex justify-between items-center text-[11px] text-[#6F6F6F] pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-gray-400 hover:text-black transition-colors"
                disabled={loading}
              >
                ویرایش شماره موبایل
              </button>

              {timerActive ? (
                <span>ارسال مجدد کد پس از: <strong className="font-mono text-black font-semibold">{timer} ثانیه</strong></span>
              ) : (
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  className="text-[#D9A8A0] font-semibold hover:underline"
                  disabled={loading}
                >
                  ارسال مجدد کد تایید
                </button>
              )}
            </div>
          </form>
        )}

        {/* Informative Test Accounts Help Footer */}
        <div className="border-t border-[#ECE7E3]/60 pt-4 text-[10px] text-[#6F6F6F] leading-normal font-light space-y-1">
          <p className="font-semibold text-black flex items-center gap-1">
            <Sparkles size={11} className="text-[#D9A8A0]" />
            راهنمای ورود آزمایشی سریع:
          </p>
          <p>شماره موبایل مدیریت ادمین: <strong className="font-mono text-black">09121111111</strong></p>
          <p>شماره موبایل مشتری معمولی: <strong className="font-mono text-black">09123456789</strong></p>
          <p>کد تایید ورود پیش‌فرض برای تمامی شماره‌ها: <strong className="font-mono text-black">123456</strong></p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto py-24 text-center">
        <p className="text-xs text-gray-500">در حال بارگذاری فرم ورود...</p>
      </div>
    }>
      <LoginInner />
    </Suspense>
  );
}
