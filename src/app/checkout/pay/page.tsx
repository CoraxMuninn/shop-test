"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, XCircle, CheckCircle2 } from "lucide-react";

function MockPayInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authority = searchParams.get("authority") || "";
  const amount = searchParams.get("amount") || "0";
  const orderId = searchParams.get("orderId") || "";

  const [loading, setLoading] = useState(false);

  const handlePaySuccess = () => {
    setLoading(true);
    setTimeout(() => {
      // Successful callback redirect
      router.push(`/checkout/payment-callback?authority=${authority}&status=OK&orderId=${orderId}`);
    }, 1000);
  };

  const handlePayCancel = () => {
    setLoading(true);
    setTimeout(() => {
      // Canceled callback redirect
      router.push(`/checkout/payment-callback?authority=${authority}&status=CANCEL&orderId=${orderId}`);
    }, 800);
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full bg-white border border-[#ECE7E3] shadow-2xl sharp-corners p-6 sm:p-8 space-y-8 text-right relative">
        
        {/* Gateway Brand Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#D9A8A0] rounded-full flex items-center justify-center text-white font-bold font-serif text-sm">ZP</div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#1A1A1A]">درگاه پرداخت اینترنتی زرین‌پال</span>
              <span className="text-[9px] text-gray-400 font-mono">ZarinPal Secure Gateway</span>
            </div>
          </div>
          <Shield size={24} className="text-green-600" />
        </div>

        {/* Transaction details box */}
        <div className="bg-[#FAF8F6] border border-[#ECE7E3] p-4 sharp-corners space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span className="text-[#6F6F6F]">نام پذیرنده:</span>
            <strong className="text-[#1A1A1A]">فروشگاه لباس زیر زنانه Lebaszirzanane</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6F6F6F]">کد تراکنش (شناسه مرجع):</span>
            <strong className="text-[#1A1A1A] font-mono font-normal">{authority}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6F6F6F]">مبلغ تراکنش:</span>
            <strong className="text-[#1A1A1A] text-md font-bold text-green-700 font-serif">
              {Number(amount).toLocaleString("fa-IR")} تومان
            </strong>
          </div>
        </div>

        {/* Card Form Mock inputs */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-[#1A1A1A] border-r-2 border-[#D9A8A0] pr-2">شبیه‌سازی اطلاعات کارت بانکی</h4>
          
          <div className="space-y-2 text-xs">
            <p className="text-gray-400 leading-normal font-light">
              این یک شبیه‌ساز امن است تا بتوانید چرخه پرداخت، کسر از انبار، ثبت سفارشات موفق/ناموفق در پنل مدیریت را کاملاً آزمایش کنید. نیازی به ورود شماره کارت واقعی نیست.
            </p>
          </div>
        </div>

        {/* Buttons Action */}
        <div className="flex flex-col sm:flex-row gap-4 border-t border-gray-100 pt-6">
          <button
            onClick={handlePaySuccess}
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-3 px-6 text-xs font-semibold hover:bg-green-700 transition-colors sharp-corners flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-gray-300"
          >
            <CheckCircle2 size={16} />
            {loading ? "در حال انتقال..." : "شبیه‌سازی پرداخت موفق"}
          </button>
          <button
            onClick={handlePayCancel}
            disabled={loading}
            className="flex-1 bg-red-600 text-white py-3 px-6 text-xs font-semibold hover:bg-red-700 transition-colors sharp-corners flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-gray-300"
          >
            <XCircle size={16} />
            انصراف و بازگشت
          </button>
        </div>

        {/* Security Footer */}
        <div className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
          <Shield size={12} className="text-green-500" />
          <span>اتصال رمزگذاری شده SSL با استانداردهای امنیتی بانکی شاپرک</span>
        </div>
      </div>
    </div>
  );
}

export default function MockPayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center" dir="rtl">
        <p className="text-xs text-gray-500">در حال بارگذاری درگاه پرداخت...</p>
      </div>
    }>
      <MockPayInner />
    </Suspense>
  );
}
