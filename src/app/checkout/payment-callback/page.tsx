"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Printer, ShoppingBag, Eye, ShieldAlert, FileText } from "lucide-react";

function PaymentCallbackInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const authority = searchParams.get("authority") || "";
  const status = searchParams.get("status") || "";
  const orderId = searchParams.get("orderId") || "";

  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Trigger verify on mount
  useEffect(() => {
    if (orderId) {
      verifyPayment();
    } else {
      setVerifying(false);
      setErrorMessage("اطلاعات سفارش برای تایید در دسترس نیست.");
    }
  }, [orderId, authority, status]);

  const verifyPayment = async () => {
    try {
      const res = await fetch("/api/order/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, authority, status }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setOrder(data.order);
      } else {
        setSuccess(false);
        setErrorMessage(data.error || "تراکنش بانکی ناموفق بود یا توسط کاربر لغو گردید.");
      }
    } catch (e) {
      setErrorMessage("بروز خطا در ارتباط با سرور جهت تایید سفارش.");
    } finally {
      setVerifying(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (verifying) {
    return (
      <div className="py-24 text-center max-w-md mx-auto" dir="rtl">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-[#D9A8A0] border-t-transparent rounded-full"></div>
        <p className="text-xs text-[#6F6F6F] mt-3">در حال استعلام وضعیت پرداخت از سرور مرکزی زرین‌پال...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-right font-light" dir="rtl">
      
      {/* SUCCESS CARD */}
      {success && order ? (
        <div className="space-y-8 print:p-0">
          
          {/* Main Success message box */}
          <div className="bg-green-50 border border-green-200 p-8 sharp-corners text-center space-y-4 shadow-sm print:bg-white print:border-none">
            <CheckCircle2 size={56} className="mx-auto text-green-600 print:text-black" />
            <h1 className="text-2xl font-light text-green-800 font-serif print:text-black">سفارش شما با موفقیت ثبت و پرداخت گردید!</h1>
            <p className="text-xs text-green-700 leading-relaxed font-light max-w-md mx-auto print:text-black">
              سفارش شما در وضعیت <strong className="font-semibold text-black">پرداخت شده</strong> ثبت شد. بسته‌بندی شما بلافاصله وارد مرحله پردازش انبار و تحویل به پست‌چی گردید. پیامک وضعیت متعاقباً برای شما ارسال می‌شود.
            </p>
          </div>

          {/* Receipt Info details */}
          <div className="border border-[#ECE7E3] p-6 bg-white sharp-corners space-y-6 shadow-sm">
            <div className="flex justify-between items-center border-b border-[#ECE7E3] pb-3">
              <h2 className="font-bold text-sm text-[#1A1A1A] flex items-center gap-2">
                <FileText size={18} className="text-[#D9A8A0]" />
                فاکتور نهایی خرید لوکس
              </h2>
              <button
                onClick={handlePrint}
                className="text-xs text-[#1A1A1A] hover:text-[#D9A8A0] border border-[#1A1A1A] px-3 py-1.5 sharp-corners transition-colors flex items-center gap-1 cursor-pointer print:hidden"
              >
                <Printer size={12} />
                چاپ فاکتور محرمانه
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-gray-400 block">شماره سفارش:</span>
                <strong className="text-[#1A1A1A] font-mono">{order.id.slice(0, 8).toUpperCase()}</strong>
              </div>
              <div className="space-y-1">
                <span className="text-gray-400 block">کد پیگیری تراکنش زرین‌پال:</span>
                <strong className="text-[#1A1A1A] font-mono text-green-700 print:text-black">{order.paymentRefId}</strong>
              </div>
              <div className="space-y-1">
                <span className="text-gray-400 block">مبلغ کل فاکتور:</span>
                <strong className="text-[#1A1A1A]">{order.totalAmount.toLocaleString("fa-IR")} تومان</strong>
              </div>
              <div className="space-y-1">
                <span className="text-gray-400 block">وضعیت سفارش:</span>
                <strong className="text-green-700 font-semibold print:text-black">پرداخت موفق (آماده ارسال)</strong>
              </div>
            </div>

            {/* Address snapshot review */}
            {order.shippingAddress && (
              <div className="border-t border-gray-100 pt-4 text-xs space-y-2">
                <span className="text-gray-400 block">آدرس محل تحویل گیرنده:</span>
                <p className="text-[#1A1A1A] font-normal leading-relaxed">
                  {(() => {
                    try {
                      const addr = JSON.parse(order.shippingAddress);
                      return `${addr.province}، ${addr.city}، ${addr.address} (تلفن تماس: ${addr.phone})`;
                    } catch (e) {
                      return order.shippingAddress;
                    }
                  })()}
                </p>
              </div>
            )}

            {/* Discreet shipping notification detail */}
            {order.discreetShipping && (
              <div className="bg-[#FAF8F6] border border-[#D9A8A0]/20 p-4 sharp-corners text-xs flex gap-2 items-start text-[#1A1A1A]">
                <ShieldAlert size={16} className="text-[#D9A8A0] mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <span className="font-semibold block">حالت ارسال کاملاً محرمانه فعال است (Discreet Shipping)</span>
                  <p className="text-[#6F6F6F] leading-relaxed">
                    این سفارش به صورت ویژه در پوشش جعبه‌ای کرافت خاکی ساده بدون لوگو و مارک، و همراه با فاکتور بدون شرح کالا (ذکر کلمه البسه معمولی) چسبانده و برای مامور پست ارسال خواهد شد.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex gap-4 print:hidden">
            <Link
              href="/shop"
              className="flex-1 bg-[#1A1A1A] text-white py-3.5 text-xs font-semibold hover:bg-[#D9A8A0] transition-colors sharp-corners flex items-center justify-center gap-1.5"
            >
              <ShoppingBag size={14} />
              بازگشت به فروشگاه لباس زیر
            </Link>
            <Link
              href="/account"
              className="flex-1 border border-[#1A1A1A] text-[#1A1A1A] py-3.5 text-xs font-semibold hover:bg-gray-50 transition-colors sharp-corners flex items-center justify-center gap-1.5"
            >
              <Eye size={14} />
              پیگیری در سفارشات من
            </Link>
          </div>

        </div>
      ) : (
        /* FAILURE/CANCEL CARD */
        <div className="space-y-8 max-w-xl mx-auto">
          <div className="bg-red-50 border border-red-200 p-8 sharp-corners text-center space-y-4 shadow-sm">
            <XCircle size={56} className="mx-auto text-red-600" />
            <h1 className="text-2xl font-light text-red-800 font-serif">عملیات پرداخت ناموفق بود</h1>
            <p className="text-xs text-red-700 leading-relaxed font-light">
              {errorMessage || "تراکنش لغو شد و سفارش شما فعال نگردید. مجدداً تلاش نمایید."}
            </p>
          </div>

          <div className="flex gap-4">
            <Link
              href="/cart"
              className="flex-grow bg-[#1A1A1A] text-white py-3.5 text-xs font-semibold hover:bg-[#D9A8A0] transition-colors sharp-corners flex items-center justify-center gap-1.5"
            >
              تلاش مجدد و بازگشت به سبد خرید
            </Link>
            <Link
              href="/shop"
              className="flex-grow border border-gray-300 text-gray-500 py-3.5 text-xs hover:bg-gray-100 transition-colors sharp-corners flex items-center justify-center gap-1.5"
            >
              انصراف و گشت‌وگذار در فروشگاه
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={
      <div className="py-24 text-center max-w-md mx-auto" dir="rtl">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-[#D9A8A0] border-t-transparent rounded-full"></div>
        <p className="text-xs text-[#6F6F6F] mt-3">در حال بارگذاری وضعیت پرداخت...</p>
      </div>
    }>
      <PaymentCallbackInner />
    </Suspense>
  );
}
