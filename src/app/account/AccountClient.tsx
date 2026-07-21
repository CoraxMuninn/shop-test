"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  Edit3,
  LogOut,
  ChevronRight,
  Package,
  Truck,
  Plus,
  Trash2,
  AlertCircle,
  Clock,
  Sparkles,
  Calendar,
} from "lucide-react";
import { signOut } from "next-auth/react";

interface AccountClientProps {
  user: any;
  orders: any[];
  wishlistProducts: any[];
}

export default function AccountClient({ user, orders, wishlistProducts }: AccountClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, orders, addresses, wishlist, edit-profile
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Saved addresses list from state
  const [addresses, setAddresses] = useState<any[]>(() => {
    try {
      return JSON.parse(user.addresses || "[]");
    } catch (e) {
      return [];
    }
  });

  // Profile Edit Form State
  const [profileName, setProfileName] = useState(user.name || "");

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

  const showNotification = (msg: string, isSuccess = true) => {
    if (isSuccess) {
      setSuccess(msg);
      setError("");
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(msg);
      setSuccess("");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/user/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profileName }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showNotification("نام شما با موفقیت بروزرسانی شد.");
        router.refresh();
      } else {
        showNotification(data.error || "خطا در بروزرسانی پروفایل", false);
      }
    } catch (err) {
      showNotification("خطا در برقراری ارتباط با سرور", false);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddr),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAddresses(data.addresses);
        setShowAddForm(false);
        setNewAddress({
          title: "",
          receiver: "",
          phone: "",
          province: "تهران",
          city: "تهران",
          address: "",
          postalCode: "",
        });
        showNotification("آدرس جدید با موفقیت اضافه شد.");
      } else {
        showNotification(data.error || "خطا در ثبت آدرس جدید", false);
      }
    } catch (err) {
      showNotification("خطا در برقراری ارتباط با سرور", false);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("آیا از حذف این آدرس مطمئن هستید؟")) return;
    setLoading(true);

    try {
      const res = await fetch("/api/user/addresses/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addressId }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAddresses(data.addresses);
        showNotification("آدرس مورد نظر با موفقیت حذف شد.");
      } else {
        showNotification(data.error || "خطا در حذف آدرس", false);
      }
    } catch (err) {
      showNotification("خطا در ارتباط با سرور", false);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; bg: string; text: string }> = {
      Pending: { label: "در انتظار پرداخت", bg: "bg-yellow-50", text: "text-yellow-700" },
      Paid: { label: "پرداخت موفق / در حال آماده‌سازی", bg: "bg-green-50", text: "text-green-700" },
      Shipped: { label: "ارسال شده", bg: "bg-blue-50", text: "text-blue-700" },
      Delivered: { label: "تحویل داده شده", bg: "bg-gray-100", text: "text-gray-700" },
      Cancelled: { label: "لغو شده", bg: "bg-red-50", text: "text-red-700" },
    };
    const b = badges[status] || { label: status, bg: "bg-gray-50", text: "text-gray-600" };
    return (
      <span className={`px-2.5 py-1 text-[11px] font-semibold sharp-corners ${b.bg} ${b.text}`}>
        {b.label}
      </span>
    );
  };

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <div className="text-right flex flex-col space-y-8" dir="rtl">
      {/* Toast Alert popups */}
      {success && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-green-700 text-white text-xs px-6 py-3.5 sharp-corners shadow-xl flex items-center gap-1.5 fade-in">
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white text-xs px-6 py-3.5 sharp-corners shadow-xl flex items-center gap-1.5 fade-in">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {/* Account Dashboard Top intro */}
      <div className="border-b border-[#ECE7E3] pb-6 mb-4">
        <h1 className="text-2xl font-light text-[#1A1A1A] font-serif">داشبورد حساب کاربری</h1>
        <p className="text-xs text-[#6F6F6F] mt-1.5 font-light">
          به کلوپ مشتریان لوکس لبلس زیر زنانه خوش آمدید، {user.name || "خریدار لوکس"}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* RIGHT SIDE: Vertical Tab Buttons (Span 1) */}
        <div className="lg:col-span-1 bg-[#FAF8F6] border border-[#ECE7E3] sharp-corners p-4 flex flex-col gap-1">
          {[
            { id: "dashboard", label: "خلاصه فعالیت‌ها", icon: <Package size={16} /> },
            { id: "orders", label: "سفارش‌های من", icon: <ShoppingBag size={16} /> },
            { id: "addresses", label: "نشانی‌های ارسال", icon: <MapPin size={16} /> },
            { id: "wishlist", label: "علاقه‌مندی‌های من", icon: <Heart size={16} /> },
            { id: "edit-profile", label: "ویرایش پروفایل", icon: <Edit3 size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full py-3 px-4 text-xs font-semibold text-right flex items-center gap-2.5 transition-all sharp-corners cursor-pointer border-r-2 ${
                activeTab === tab.id
                  ? "border-[#D9A8A0] text-[#D9A8A0] bg-white"
                  : "border-transparent text-[#6F6F6F] hover:text-[#1A1A1A]"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 text-xs font-semibold text-right flex items-center gap-2.5 text-red-600 hover:bg-red-50 border-r-2 border-transparent transition-all sharp-corners cursor-pointer mt-4"
          >
            <LogOut size={16} />
            خروج از حساب کاربری
          </button>
        </div>

        {/* LEFT SIDE: Dynamic Tab Content Panel (Span 3) */}
        <div className="lg:col-span-3 min-h-[50vh]">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-[#FAF8F6] border border-[#ECE7E3] p-5 sharp-corners space-y-2 text-center">
                  <span className="text-xs text-[#6F6F6F] block">سفارش‌های ثبت شده</span>
                  <strong className="text-2xl font-serif text-[#1A1A1A]">{orders.length}</strong>
                </div>
                <div className="bg-[#FAF8F6] border border-[#ECE7E3] p-5 sharp-corners space-y-2 text-center">
                  <span className="text-xs text-[#6F6F6F] block">آدرس‌های ثبت شده</span>
                  <strong className="text-2xl font-serif text-[#1A1A1A]">{addresses.length}</strong>
                </div>
                <div className="bg-[#FAF8F6] border border-[#ECE7E3] p-5 sharp-corners space-y-2 text-center">
                  <span className="text-xs text-[#6F6F6F] block">لیست علاقه‌مندی‌ها</span>
                  <strong className="text-2xl font-serif text-[#1A1A1A]">{wishlistProducts.length}</strong>
                </div>
              </div>

              <div className="border border-[#ECE7E3] p-6 bg-white sharp-corners space-y-4">
                <h3 className="font-bold text-sm text-[#1A1A1A] border-b border-[#ECE7E3] pb-2">اطلاعات حساب من</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[#6F6F6F]">نام و نام خانوادگی:</span>
                    <strong className="text-[#1A1A1A] block mt-0.5">{user.name || "نامشخص"}</strong>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[#6F6F6F]">شماره تلفن همراه:</span>
                    <strong className="text-[#1A1A1A] block font-mono mt-0.5">{user.phone}</strong>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[#6F6F6F]">تاریخ عضویت در کلوپ:</span>
                    <strong className="text-[#1A1A1A] block mt-0.5">
                      {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                    </strong>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[#6F6F6F]">سطح دسترسی کاربری:</span>
                    <strong className="text-[#D9A8A0] font-semibold block mt-0.5">
                      {user.role === "Admin" ? "مدیر کل سامانه" : "عضو رسمی طلایی"}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY ORDERS */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <h2 className="font-bold text-sm text-[#1A1A1A] border-b border-[#ECE7E3] pb-2.5 mb-4">تاریخچه سفارش‌های من</h2>
              {orders.length === 0 ? (
                <div className="text-center py-12 bg-[#FAF8F6] border border-[#ECE7E3] sharp-corners text-gray-500">
                  <ShoppingBag size={36} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-xs">شما هنوز هیچ سفارشی ثبت نکرده‌اید.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-[#ECE7E3] sharp-corners p-4 sm:p-5 bg-white space-y-4 shadow-sm text-xs"
                    >
                      {/* Summary head */}
                      <div className="flex flex-wrap justify-between items-center gap-2 border-b border-gray-50 pb-3">
                        <div className="flex gap-4">
                          <span>سفارش: <strong className="font-mono text-[#1A1A1A]">{order.id.slice(0, 8).toUpperCase()}</strong></span>
                          <span>تاریخ: <strong className="text-[#1A1A1A]">{new Date(order.createdAt).toLocaleDateString("fa-IR")}</strong></span>
                        </div>
                        <div>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        {order.items.map((item: any, itemIdx: number) => (
                          <div key={itemIdx} className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-3">
                              <span className="w-1.5 h-1.5 bg-[#D9A8A0] rounded-full"></span>
                              <Link
                                href={`/product/${item.product.slug}`}
                                className="hover:text-[#D9A8A0] transition-colors"
                              >
                                {item.productTitleSnapshot}
                              </Link>
                              <span className="text-gray-400 font-light">
                                ({item.color} / {item.size}) × {item.quantity} عدد
                              </span>
                            </div>
                            <span className="font-semibold">
                              {((item.unitPrice * item.quantity)).toLocaleString("fa-IR")} تومان
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Invoice totals and discreet indicators */}
                      <div className="border-t border-gray-50 pt-3 flex flex-wrap justify-between items-center gap-2">
                        <div className="flex gap-4 items-center">
                          <span className="text-[#6F6F6F]">کل پرداختی:</span>
                          <strong className="text-sm font-bold text-[#1A1A1A]">
                            {order.totalAmount.toLocaleString("fa-IR")} تومان
                          </strong>
                        </div>

                        {order.trackingCode && (
                          <div className="flex gap-2 items-center text-xs">
                            <span className="text-[#6F6F6F]">کد مرسوله پستی:</span>
                            <strong className="bg-[#FAF8F6] px-2 py-1 border border-[#ECE7E3] font-mono text-[#1A1A1A]">
                              {order.trackingCode}
                            </strong>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADDRESSES */}
          {activeTab === "addresses" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-[#ECE7E3] pb-2.5 mb-4">
                <h2 className="font-bold text-sm text-[#1A1A1A]">نشانی‌های ارسال من</h2>
                {!showAddForm && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center gap-1 text-[11px] text-[#D9A8A0] font-bold hover:underline cursor-pointer"
                  >
                    <Plus size={14} />
                    افزودن آدرس جدید
                  </button>
                )}
              </div>

              {/* Add Address Form Modal/Panel */}
              {showAddForm && (
                <form onSubmit={handleAddAddress} className="border border-[#ECE7E3] p-5 bg-[#FAF8F6] sharp-corners space-y-4">
                  <h4 className="font-bold text-xs text-[#1A1A1A]">ثبت آدرس تحویل جدید</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-[#1A1A1A]">عنوان آدرس (مثال: خانه، دفتر کار)</label>
                      <input
                        type="text"
                        required
                        placeholder="خانه"
                        value={newAddr.title}
                        onChange={(e) => setNewAddress({ ...newAddr, title: e.target.value })}
                        className="w-full text-xs p-2.5 border border-[#ECE7E3] bg-white outline-none focus:ring-1 focus:ring-[#D9A8A0] sharp-corners"
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
                        className="w-full text-xs p-2.5 border border-[#ECE7E3] bg-white outline-none focus:ring-1 focus:ring-[#D9A8A0] sharp-corners"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-[#1A1A1A]">شماره تلفن همراه گیرنده</label>
                      <input
                        type="text"
                        required
                        placeholder="09123456789"
                        value={newAddr.phone}
                        onChange={(e) => setNewAddress({ ...newAddr, phone: e.target.value })}
                        className="w-full text-xs p-2.5 border border-[#ECE7E3] bg-white outline-none focus:ring-1 focus:ring-[#D9A8A0] sharp-corners"
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
                        className="w-full text-xs p-2.5 border border-[#ECE7E3] bg-white outline-none focus:ring-1 focus:ring-[#D9A8A0] sharp-corners"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-[#1A1A1A]">استان</label>
                      <input
                        type="text"
                        required
                        value={newAddr.province}
                        onChange={(e) => setNewAddress({ ...newAddr, province: e.target.value })}
                        className="w-full text-xs p-2.5 border border-[#ECE7E3] bg-white outline-none focus:ring-1 focus:ring-[#D9A8A0] sharp-corners"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-[#1A1A1A]">شهر</label>
                      <input
                        type="text"
                        required
                        value={newAddr.city}
                        onChange={(e) => setNewAddress({ ...newAddr, city: e.target.value })}
                        className="w-full text-xs p-2.5 border border-[#ECE7E3] bg-white outline-none focus:ring-1 focus:ring-[#D9A8A0] sharp-corners"
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
                      className="w-full text-xs p-2.5 border border-[#ECE7E3] bg-white outline-none focus:ring-1 focus:ring-[#D9A8A0] sharp-corners"
                    ></textarea>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#1A1A1A] text-white text-xs px-6 py-2.5 hover:bg-[#D9A8A0] transition-colors sharp-corners cursor-pointer font-semibold"
                    >
                      ثبت آدرس جدید
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

              {addresses.length === 0 ? (
                <div className="text-center py-12 bg-[#FAF8F6] border border-[#ECE7E3] sharp-corners text-gray-500">
                  <MapPin size={36} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-xs">هیچ آدرسی ثبت نکرده‌اید.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((addr: any) => (
                    <div
                      key={addr.id}
                      className="border border-[#ECE7E3] p-5 sharp-corners bg-white shadow-sm flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                          <strong className="text-sm font-semibold text-[#1A1A1A]">{addr.title}</strong>
                          <span className="text-[10px] text-gray-400">گیرنده: {addr.receiver}</span>
                        </div>
                        <p className="text-xs text-[#6F6F6F] leading-relaxed line-clamp-3 font-light">
                          {addr.province}، {addr.city}، {addr.address}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          کد پستی: {addr.postalCode} | تلفن: {addr.phone}
                        </p>
                      </div>
                      <div className="border-t border-gray-50 pt-2 flex justify-end">
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          disabled={loading}
                          className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 size={13} />
                          حذف آدرس
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: WISHLIST */}
          {activeTab === "wishlist" && (
            <div className="space-y-4">
              <h2 className="font-bold text-sm text-[#1A1A1A] border-b border-[#ECE7E3] pb-2.5 mb-4">لیست علاقه‌مندی‌های من</h2>
              {wishlistProducts.length === 0 ? (
                <div className="text-center py-12 bg-[#FAF8F6] border border-[#ECE7E3] sharp-corners text-gray-500">
                  <Heart size={36} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-xs">هیچ محصولی در لیست علاقه‌مندی‌های شما قرار ندارد.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {wishlistProducts.map((p) => {
                    let firstImage = "/images/bra-luxury.jpg";
                    try {
                      const vars = typeof p.variants === "string" ? JSON.parse(p.variants) : p.variants;
                      if (vars?.[0]?.images?.[0]) firstImage = vars[0].images[0];
                    } catch (e) {}

                    return (
                      <div key={p.id} className="border border-[#ECE7E3]/40 p-3 bg-white sharp-corners flex flex-col space-y-3 relative group">
                        <div className="h-60 overflow-hidden bg-[#FAF8F6] border border-[#ECE7E3]/30 sharp-corners">
                          <img src={firstImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" />
                        </div>
                        <div className="text-right flex flex-col space-y-1">
                          <span className="text-[10px] text-[#6F6F6F] font-light">{p.category.name}</span>
                          <h4 className="font-light text-xs text-[#1A1A1A] truncate">
                            <Link href={`/product/${p.slug}`} className="hover:underline hover:text-[#D9A8A0] transition-colors">{p.title}</Link>
                          </h4>
                          <strong className="text-xs font-semibold text-[#1A1A1A] mt-1">
                            {p.basePrice.toLocaleString("fa-IR")} تومان
                          </strong>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: EDIT PROFILE */}
          {activeTab === "edit-profile" && (
            <div className="space-y-6 max-w-xl">
              <h2 className="font-bold text-sm text-[#1A1A1A] border-b border-[#ECE7E3] pb-2.5 mb-4">ویرایش اطلاعات پروفایل کاربری</h2>
              
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1A1A1A]">شماره تلفن همراه (غیرقابل ویرایش)</label>
                  <input
                    type="text"
                    disabled
                    value={user.phone}
                    className="w-full text-xs p-3 border border-[#ECE7E3] bg-gray-50 text-gray-400 font-mono outline-none sharp-corners cursor-not-allowed"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1A1A1A]">نام و نام خانوادگی خریدار</label>
                  <input
                    type="text"
                    required
                    placeholder="نام کامل خود را بنویسید"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full text-xs p-3 border border-[#ECE7E3] bg-[#FAF8F6] focus:bg-white focus:ring-1 focus:ring-[#D9A8A0] outline-none sharp-corners"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || !profileName.trim()}
                    className="bg-[#1A1A1A] text-white text-xs font-semibold px-8 py-3.5 sharp-corners hover:bg-[#D9A8A0] transition-colors cursor-pointer"
                  >
                    {loading ? "در حال ذخیره‌سازی..." : "بروزرسانی مشخصات کاربری"}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
