"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  MapPin,
  Truck,
  Plus,
  ShieldCheck,
  AlertCircle,
  CreditCard,
  Building,
  User as UserIcon,
  Phone,
} from "lucide-react";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const { cart, clearCart } = useApp();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/checkout");
    }
  }, [status, router]);

  // State
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [discreetShipping, setDiscreetShipping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Totals loaded from localStorage
  const [totals, setTotals] = useState<{
    subtotal: number;
    discountAmount: number;
    shippingCost: number;
    totalAmount: number;
    discountCodeId: string | null;
  } | null>(null);

  // Add Address Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddr, setNewAddress] = useState({
    title: "",
    receiver: "",
    phone: "",
    province: "تهران",
    city: "تهران",
    address: "",
    postalCode: "",
  });

  // Fetch saved addresses on mount
  useEffect(() => {
    if (status === "authenticated") {
      fetchAddresses();
    }

    const storedTotals = localStorage.getItem("lebaszir_checkout_totals");
    if (storedTotals) {
      try {
        setTotals(JSON.parse(storedTotals));
      } catch (e) {}
    }
  }, [status]);

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        const addrs = JSON.parse(data.addresses || "[]");
        setAddresses(addrs);
        if (addrs.length > 0) {
          setSelectedAddressId(addrs[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to fetch user addresses:", e);
    }
  };

  const handleAddAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddr),
      });

      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses);
        const added = data.addresses[data.addresses.length - 1];
        setSelectedAddressId(added.id);
        setShowAddForm(false);
        // Reset form
        setNewAddress({
          title: "",
          receiver: "",
          phone: "",
          province: "تهران",
          city: "تهران",
          address: "",
          postalCode: "",
        });
      } else {
        const data = await res.json();
        setError(data.error || "خطا در ذخیره‌سازی آدرس جدید");
      }
    } catch (e) {
      setError("خطا در برقراری ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckoutSubmit = async () => {
    setError("");
    if (!selectedAddressId) {
      setError("لطفاً یک آدرس برای تحویل کالا انتخاب یا ثبت کنید.");
      return;
    }

    if (!totals) {
      setError("اطلاعات خرید منقضی شده است. به سبد خرید بازگردید.");
      return;
    }

    setLoading(true);
    const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

    try {
      const res = await fetch("/api/order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          address: selectedAddress,
          discreetShipping,
          discountCodeId: totals.discountCodeId,
          discountAmount: totals.discountAmount,
          totalAmount: totals.totalAmount,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // SUCCESS: Order created with status Pending and stock decremented.
        // Clear guest cart
        clearCart();
        // Redirect to mock pay page
        router.push(`/checkout/pay?authority=${data.authority}&amount=${totals.totalAmount}&orderId=${data.orderId}`);
      } else {
        setError(data.error || "ثبت سفارش ناموفق بود. احتمالاً موجودی انبار تغییر کرده است.");
      }
    } catch (e) {
      setError("خطایی در ثبت نهایی سفارش در سیستم رخ داد.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="py-24 text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-[#D9A8A0] border-t-transparent rounded-full"></div>
        <p className="text-xs text-[#6F6F6F] mt-2">در حال بارگذاری اطلاعات خریدار لوکس...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-right font-light" dir="rtl">
      <h1 className="text-2xl font-light text-[#1A1A1A] font-serif mb-10 border-b border-[#ECE7E3] pb-4">
        تکمیل سفارش و تسویه حساب
      </h1>

      {error && (
        <div className="bg-red-50 text-red-700 text-xs p-4 mb-8 sharp-corners border border-red-200 flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* RIGHT SIDE: Shipping, Address & discreet options (Span 8) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 1. Address Section */}
          <div className="border border-[#ECE7E3] p-6 bg-white sharp-corners space-y-4">
            <h3 className="font-bold text-sm text-[#1A1A1A] border-b border-[#ECE7E3] pb-3 flex items-center gap-2">
              <MapPin size={18} className="text-[#D9A8A0]" />
              آدرس تحویل سفارش
            </h3>

            {/* List of current addresses */}
            {addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 border sharp-corners cursor-pointer transition-colors space-y-2 ${
                      selectedAddressId === addr.id
                        ? "border-[#D9A8A0] bg-[#FAF8F6]"
                        : "border-[#ECE7E3] hover:border-gray-400"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-[#1A1A1A]">{addr.title}</span>
                      <span className="text-[10px] text-gray-400 font-mono">گیرنده: {addr.receiver}</span>
                    </div>
                    <p className="text-[11px] text-[#6F6F6F] leading-relaxed line-clamp-2">
                      {addr.province}، {addr.city}، {addr.address}
                    </p>
                    <div className="text-[10px] text-gray-400 font-mono pt-1">
                      کد پستی: {addr.postalCode}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 py-2">هیچ آدرس ذخیره‌شده‌ای یافت نشد. لطفاً آدرس جدید خود را ثبت کنید.</p>
            )}

            {/* Toggle Add Address Form Button */}
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-1.5 border border-[#1A1A1A] text-[#1A1A1A] text-xs font-semibold px-4 py-2 hover:bg-[#D9A8A0] hover:text-white hover:border-[#D9A8A0] transition-colors sharp-corners cursor-pointer mt-2"
              >
                <Plus size={14} />
                افزودن آدرس جدید
              </button>
            )}

            {/* Add Address Form Modal/Panel */}
            {showAddForm && (
              <form onSubmit={handleAddAddressSubmit} className="border border-[#ECE7E3] p-5 bg-[#FAF8F6] sharp-corners mt-4 space-y-4">
                <h4 className="font-bold text-xs text-[#1A1A1A]">مشخصات آدرس جدید</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-[#1A1A1A]">عنوان آدرس (مثال: خانه، دفتر کار)</label>
                    <input
                      type="text"
                      required
                      placeholder="خانه"
                      value={newAddr.title}
                      onChange={(e) => setNewAddress({ ...newAddr, title: e.target.value })}
                      className="w-full text-xs p-2.5 border border-[#ECE7E3] bg-white outline-none focus:ring-1 focus:ring-[#D9A8A0]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-[#1A1A1A]">نام و نام خانوادگی گیرنده</label>
                    <input
                      type="text"
                      required
                      placeholder="سارا احمدی"
                      value={newAddr.receiver}
                      onChange={(e) => setNewAddress({ ...newAddr, receiver: e.target.value })}
                      className="w-full text-xs p-2.5 border border-[#ECE7E3] bg-white outline-none focus:ring-1 focus:ring-[#D9A8A0]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-[#1A1A1A]">شماره تلفن تماس گیرنده</label>
                    <input
                      type="text"
                      required
                      placeholder="09123456789"
                      value={newAddr.phone}
                      onChange={(e) => setNewAddress({ ...newAddr, phone: e.target.value })}
                      className="w-full text-xs p-2.5 border border-[#ECE7E3] bg-white outline-none focus:ring-1 focus:ring-[#D9A8A0]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-[#1A1A1A]">کد پستی (۱۰ رقمی)</label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      placeholder="1939512345"
                      value={newAddr.postalCode}
                      onChange={(e) => setNewAddress({ ...newAddr, postalCode: e.target.value })}
                      className="w-full text-xs p-2.5 border border-[#ECE7E3] bg-white outline-none focus:ring-1 focus:ring-[#D9A8A0]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-[#1A1A1A]">استان</label>
                    <input
                      type="text"
                      required
                      value={newAddr.province}
                      onChange={(e) => setNewAddress({ ...newAddr, province: e.target.value })}
                      className="w-full text-xs p-2.5 border border-[#ECE7E3] bg-white outline-none focus:ring-1 focus:ring-[#D9A8A0]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-[#1A1A1A]">شهر</label>
                    <input
                      type="text"
                      required
                      value={newAddr.city}
                      onChange={(e) => setNewAddress({ ...newAddr, city: e.target.value })}
                      className="w-full text-xs p-2.5 border border-[#ECE7E3] bg-white outline-none focus:ring-1 focus:ring-[#D9A8A0]"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-[#1A1A1A]">نشانی پستی دقیق</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="خیابان شریعتی، کوچه یاس، پلاک ۴..."
                    value={newAddr.address}
                    onChange={(e) => setNewAddress({ ...newAddr, address: e.target.value })}
                    className="w-full text-xs p-2.5 border border-[#ECE7E3] bg-white outline-none focus:ring-1 focus:ring-[#D9A8A0]"
                  ></textarea>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-[#1A1A1A] text-white text-xs px-6 py-2.5 hover:bg-[#D9A8A0] transition-colors sharp-corners cursor-pointer font-semibold"
                  >
                    ذخیره و انتخاب آدرس
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="border border-gray-300 text-gray-500 text-xs px-6 py-2.5 hover:bg-gray-100 transition-colors sharp-corners cursor-pointer"
                  >
                    انصراف
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* 2. Order Privacy & Discreet Shipping Option */}
          <div className="border border-[#ECE7E3] p-6 bg-white sharp-corners space-y-4">
            <h3 className="font-bold text-sm text-[#1A1A1A] border-b border-[#ECE7E3] pb-3 flex items-center gap-2">
              <Truck size={18} className="text-[#D9A8A0]" />
              حریم خصوصی و حراست بسته‌بندی (Discreet Shipping)
            </h3>
            
            <p className="text-xs text-[#6F6F6F] leading-relaxed">
              جهت حفظ کامل حریم خصوصی شما، البسه زیر به صورت پیش‌فرض در پاکت‌های نود مات ضخیم و بدون هیچگونه لوگو، عنوان، هولوگرام یا نامی از دسته محصول ارسال خواهند شد.
            </p>

            <div className="p-4 bg-[#FAF8F6] border border-[#ECE7E3] sharp-corners">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={discreetShipping}
                  onChange={(e) => setDiscreetShipping(e.target.checked)}
                  className="w-4 h-4 accent-[#D9A8A0] border-[#ECE7E3] mt-0.5"
                  style={{ borderRadius: "0px" }}
                />
                <div className="flex flex-col space-y-1">
                  <span className="text-xs font-semibold text-[#1A1A1A]">درخواست صدور فاکتور محرمانه چاپی</span>
                  <span className="text-[10px] text-[#6F6F6F] leading-relaxed">
                    با فعال کردن این گزینه، برگه کاغذ فاکتور فیزیکی همراه با مرسوله نیز کاملاً عمومی صادر شده و نام اقلام به عنوان «البسه عمومی» قید خواهد شد.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* LEFT SIDE: Order Review and Gateway Connect (Span 4) */}
        <div className="lg:col-span-4 bg-[#FAF8F6] border border-[#ECE7E3] p-6 sharp-corners space-y-6">
          <h3 className="font-bold text-sm text-[#1A1A1A] border-b border-[#ECE7E3] pb-3">تایید پیش فاکتور سفارش</h3>

          {/* Miniature Cart Items */}
          <div className="space-y-3.5 max-h-48 overflow-y-auto border-b border-[#ECE7E3]/60 pb-4">
            {cart.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-center text-xs">
                <img src={item.image} alt="" className="w-10 h-12 object-cover sharp-corners" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-normal text-[#1A1A1A] truncate">{item.title}</h4>
                  <p className="text-[10px] text-gray-400 font-light mt-0.5">
                    {item.color} / {item.size} × {item.quantity} عدد
                  </p>
                </div>
                <span className="font-semibold text-[#1A1A1A]">
                  {((item.price * item.quantity)).toLocaleString("fa-IR")} تومان
                </span>
              </div>
            ))}
          </div>

          {/* Pricing totals block */}
          {totals && (
            <div className="space-y-3 text-xs text-[#6F6F6F] font-light">
              <div className="flex justify-between">
                <span>جمع کل خرید</span>
                <span className="text-[#1A1A1A] font-semibold">{totals.subtotal.toLocaleString("fa-IR")} تومان</span>
              </div>
              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>تخفیف کسر شده</span>
                  <span className="font-semibold">-{totals.discountAmount.toLocaleString("fa-IR")} تومان</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>هزینه حمل و نقل</span>
                {totals.shippingCost === 0 ? (
                  <span className="text-green-700 font-semibold">رایگان</span>
                ) : (
                  <span className="text-[#1A1A1A] font-semibold">{totals.shippingCost.toLocaleString("fa-IR")} تومان</span>
                )}
              </div>

              <div className="border-t border-[#ECE7E3] pt-4 flex justify-between items-end text-sm">
                <span className="font-semibold text-[#1A1A1A]">مبلغ نهایی فاکتور</span>
                <span className="text-lg font-bold text-[#1A1A1A] font-serif">
                  {totals.totalAmount.toLocaleString("fa-IR")} تومان
                </span>
              </div>
            </div>
          )}

          {/* Proceed Button */}
          <div className="pt-2">
            <button
              onClick={handleCheckoutSubmit}
              disabled={loading || cart.length === 0}
              className="w-full bg-[#1A1A1A] text-white py-3.5 text-xs font-semibold hover:bg-[#D9A8A0] transition-colors sharp-corners flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-300"
            >
              <CreditCard size={16} />
              {loading ? "در حال ثبت سفارش..." : "تایید سفارش و پرداخت آنلاین زرین‌پال"}
            </button>
          </div>

          <p className="text-[9px] text-gray-400 text-center leading-normal pt-2 font-light">
            * با کلیک روی دکمه بالا، سفارش شما به عنوان در حال انتظار انبار ثبت شده و جهت تصفیه مالی به درگاه امن زرین‌پال هدایت خواهید شد.
          </p>
        </div>

      </div>
    </div>
  );
}
