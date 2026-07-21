"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { Trash2, ShoppingBag, Plus, Minus, AlertCircle, ArrowLeft, Ticket, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity } = useApp();
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{
    id: string;
    code: string;
    type: string;
    value: number;
  } | null>(null);
  const [discountError, setDiscountError] = useState("");
  const [discountSuccess, setDiscountSuccess] = useState("");
  const [checkingDiscount, setCheckingDiscount] = useState(false);
  const router = useRouter();

  // Load applied discount from localStorage if exists
  useEffect(() => {
    const stored = localStorage.getItem("lebaszir_applied_discount");
    if (stored) {
      try {
        setAppliedDiscount(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setCheckingDiscount(true);
    setDiscountError("");
    setDiscountSuccess("");

    try {
      const res = await fetch(`/api/discount?code=${encodeURIComponent(promoCode)}`);
      const data = await res.json();

      if (data.valid) {
        setAppliedDiscount(data);
        localStorage.setItem("lebaszir_applied_discount", JSON.stringify(data));
        setDiscountSuccess(`کد تخفیف ${data.code} با موفقیت اعمال شد.`);
      } else {
        setDiscountError(data.error || "کد تخفیف نامعتبر است");
      }
    } catch (e) {
      setDiscountError("خطایی در اتصال رخ داد.");
    } finally {
      setCheckingDiscount(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedDiscount(null);
    localStorage.removeItem("lebaszir_applied_discount");
    setDiscountSuccess("");
    setPromoCode("");
  };

  // Pricing calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  // Calculate discount amount
  let discountAmount = 0;
  if (appliedDiscount && subtotal > 0) {
    if (appliedDiscount.type === "Percent") {
      discountAmount = Math.round((subtotal * appliedDiscount.value) / 100);
    } else {
      discountAmount = appliedDiscount.value;
    }
  }

  // Shipping flat rate: 40,000 Toman. Free if subtotal > 800,000 Toman!
  const shippingThreshold = 800000;
  const shippingCost = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 40000;

  const totalAmount = Math.max(0, subtotal - discountAmount + shippingCost);

  // Quick navigation block
  const handleProceedCheckout = () => {
    // Save summary details to temporary checkout memory
    localStorage.setItem(
      "lebaszir_checkout_totals",
      JSON.stringify({
        subtotal,
        discountAmount,
        shippingCost,
        totalAmount,
        discountCodeId: appliedDiscount?.id || null,
      })
    );
    router.push("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center" dir="rtl">
        <div className="bg-[#FAF8F6] border border-[#ECE7E3] p-12 sharp-corners space-y-6">
          <ShoppingBag size={64} className="mx-auto text-gray-200" />
          <h1 className="text-2xl font-light text-[#1A1A1A] font-serif">سبد خرید شما خالی است</h1>
          <p className="text-xs text-[#6F6F6F] max-w-sm mx-auto leading-relaxed font-light">
            به نظر می‌رسد هنوز هیچ محصولی را به سبد خود اضافه نکرده‌اید. همین حالا می‌توانید از بین کلکسیون‌های ظریف ما خرید خود را شروع کنید.
          </p>
          <div className="pt-4">
            <Link
              href="/shop"
              className="bg-[#1A1A1A] text-white text-xs font-semibold px-8 py-4 sharp-corners hover:bg-[#D9A8A0] transition-colors"
            >
              بازگشت به فروشگاه و خرید
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-right" dir="rtl">
      <h1 className="text-2xl font-light text-[#1A1A1A] font-serif mb-10 border-b border-[#ECE7E3] pb-4">
        سبد خرید من ({cart.length} محصول)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* RIGHT SIDE: Cart Items (Span 8) */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-4 border border-[#ECE7E3] sharp-corners bg-white shadow-sm"
            >
              {/* Product Thumbnail */}
              <img
                src={item.image}
                alt={item.title}
                className="w-20 h-24 object-cover bg-gray-50 sharp-corners"
              />

              {/* Item Info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/product/${item.productId}`}
                  className="font-medium text-xs sm:text-sm text-[#1A1A1A] hover:text-[#D9A8A0] transition-colors line-clamp-1"
                >
                  {item.title}
                </Link>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[11px] text-[#6F6F6F] font-light">
                  <span>رنگ: <strong className="text-[#1A1A1A] font-normal">{item.color}</strong></span>
                  <span>سایز: <strong className="text-[#1A1A1A] font-normal">{item.size}</strong></span>
                </div>
                <div className="text-xs font-semibold text-[#1A1A1A] mt-2">
                  {item.price.toLocaleString("fa-IR")} تومان
                </div>
              </div>

              {/* Quantity Changer */}
              <div className="flex items-center border border-[#ECE7E3] sharp-corners bg-[#FAF8F6]">
                <button
                  onClick={() => updateCartQuantity(item.productId, item.color, item.size, item.quantity + 1)}
                  className="px-2 py-1 text-[#1A1A1A] hover:text-[#D9A8A0]"
                >
                  <Plus size={12} />
                </button>
                <span className="px-3 text-xs font-bold">{item.quantity}</span>
                <button
                  onClick={() => updateCartQuantity(item.productId, item.color, item.size, item.quantity - 1)}
                  className="px-2 py-1 text-[#1A1A1A] hover:text-[#D9A8A0]"
                >
                  <Minus size={12} />
                </button>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => removeFromCart(item.productId, item.color, item.size)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                aria-label="حذف"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* LEFT SIDE: Order Summary (Span 4) */}
        <div className="lg:col-span-4 bg-[#FAF8F6] border border-[#ECE7E3] p-6 sharp-corners space-y-6">
          <h3 className="font-bold text-sm text-[#1A1A1A] border-b border-[#ECE7E3] pb-3 mb-4">خلاصه پیش‌فاکتور</h3>
          
          <div className="space-y-3.5 text-xs text-[#6F6F6F] font-light">
            <div className="flex justify-between">
              <span>مجموع اقلام ({cart.reduce((a, b) => a + b.quantity, 0)} عدد)</span>
              <span className="text-[#1A1A1A] font-semibold">{subtotal.toLocaleString("fa-IR")} تومان</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>تخفیف اعمال شده</span>
                <span className="font-semibold">-{discountAmount.toLocaleString("fa-IR")} تومان</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>هزینه ارسال</span>
              {shippingCost === 0 ? (
                <span className="text-green-700 font-semibold">رایگان</span>
              ) : (
                <span className="text-[#1A1A1A] font-semibold">{shippingCost.toLocaleString("fa-IR")} تومان</span>
              )}
            </div>

            {subtotal < shippingThreshold && (
              <p className="text-[10px] text-gray-400 leading-normal border-t border-[#ECE7E3]/40 pt-2 font-light">
                * با افزودن <strong>{((shippingThreshold - subtotal)).toLocaleString("fa-IR")} تومان</strong> دیگر به سبد خرید خود، از ارسال رایگان بهره‌مند شوید!
              </p>
            )}
          </div>

          {/* Discount Code Input */}
          <div className="border-t border-[#ECE7E3] pt-4">
            <h4 className="text-xs font-semibold text-[#1A1A1A] mb-2 flex items-center gap-1">
              <Ticket size={14} className="text-[#D9A8A0]" />
              کد تخفیف دارید؟
            </h4>
            
            {appliedDiscount ? (
              <div className="flex items-center justify-between bg-green-50 text-green-800 text-xs p-3 sharp-corners border border-green-100">
                <span className="flex items-center gap-1">
                  <Check size={14} />
                  کد <strong>{appliedDiscount.code}</strong> فعال است
                </span>
                <button
                  onClick={handleRemovePromo}
                  className="text-[10px] text-red-600 hover:underline cursor-pointer"
                >
                  حذف کد
                </button>
              </div>
            ) : (
              <div className="flex items-center border border-[#ECE7E3] sharp-corners overflow-hidden">
                <input
                  type="text"
                  placeholder="مثال: WELCOME"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-grow text-xs px-3 py-2.5 outline-none bg-white text-right border-none"
                />
                <button
                  onClick={handleApplyPromo}
                  disabled={checkingDiscount || !promoCode.trim()}
                  className="bg-[#1A1A1A] text-white text-xs px-4 py-2.5 hover:bg-[#D9A8A0] transition-colors disabled:bg-gray-300 cursor-pointer font-semibold"
                >
                  {checkingDiscount ? "بررسی..." : "اعمال"}
                </button>
              </div>
            )}

            {discountError && (
              <p className="text-[10px] text-red-500 mt-1.5 flex items-center gap-1">
                <AlertCircle size={12} />
                {discountError}
              </p>
            )}

            {discountSuccess && (
              <p className="text-[10px] text-green-700 mt-1.5 font-medium">
                {discountSuccess}
              </p>
            )}
          </div>

          {/* Grand Total */}
          <div className="border-t border-[#ECE7E3] pt-4 flex justify-between items-end">
            <span className="text-sm font-semibold text-[#1A1A1A]">مبلغ نهایی قابل پرداخت</span>
            <span className="text-xl font-bold text-[#1A1A1A] font-serif">
              {totalAmount.toLocaleString("fa-IR")} تومان
            </span>
          </div>

          {/* Proceed Button */}
          <div className="pt-2">
            <button
              onClick={handleProceedCheckout}
              className="w-full bg-[#1A1A1A] text-white py-3.5 text-xs font-semibold hover:bg-[#D9A8A0] transition-colors sharp-corners flex items-center justify-center gap-2 cursor-pointer"
            >
              ادامه جهت ثبت سفارش و تسویه حساب
              <ArrowLeft size={14} className="mr-1 rotate-180" />
            </button>
          </div>

          <p className="text-[10px] text-gray-400 text-center leading-normal pt-2 font-light">
            * مالیات بر ارزش افزوده و کلیه عوارض کالا از پیش روی قیمت‌ها محاسبه شده است و نیازی به پرداخت هزینه اضافه نیست.
          </p>
        </div>

      </div>
    </div>
  );
}
