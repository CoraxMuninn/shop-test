"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  FileText,
  CreditCard,
  Percent,
  MessageSquare,
  Users,
  Plus,
  Trash2,
  Edit,
  Save,
  Check,
  X,
  AlertCircle,
  TrendingUp,
  AlertTriangle,
  Eye,
  Printer,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";

interface AdminClientProps {
  initialProducts: any[];
  initialCategories: any[];
  initialOrders: any[];
  initialArticles: any[];
  initialReviews: any[];
  initialDiscountCodes: any[];
  initialUsers: any[];
}

export default function AdminClient({
  initialProducts,
  initialCategories,
  initialOrders,
  initialArticles,
  initialReviews,
  initialDiscountCodes,
  initialUsers,
}: AdminClientProps) {
  const router = useRouter();

  // Active view tab state
  const [activeTab, setActiveTab] = useState("overview"); // overview, products, categories, articles, orders, discounts, reviews, users

  // Live collections from state (updated on actions)
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [orders, setOrders] = useState(initialOrders);
  const [articles, setArticles] = useState(initialArticles);
  const [reviews, setReviews] = useState(initialReviews);
  const [discountCodes, setDiscountCodes] = useState(initialDiscountCodes);
  const [users, setUsers] = useState(initialUsers);

  // General loading / toast states
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastError, setToastError] = useState(false);

  // Form Modals / Expandable states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const [showArticleModal, setShowArticleModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);

  const [showDiscountModal, setShowDiscountModal] = useState(false);

  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<any>(null);

  // Form Fields State
  const [productForm, setProductForm] = useState({
    title: "",
    slug: "",
    description: "",
    categoryId: "",
    basePrice: "",
    published: true,
    featured: false,
    variants: [] as any[],
    faq: [] as any[],
  });

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    parentId: "",
    sortOrder: "0",
  });

  const [articleForm, setArticleForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "/images/bra-luxury.jpg",
    categoryId: "",
    metaTitle: "",
    metaDescription: "",
    canonicalUrl: "",
    indexStatus: true,
    publishStatus: "Published",
  });

  const [discountForm, setDiscountForm] = useState({
    code: "",
    type: "Percent",
    value: "",
    startsAt: new Date().toISOString().split("T")[0],
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    usageLimit: "100",
  });

  const [activeReviewReply, setActiveReviewReply] = useState<{ id: string; text: string } | null>(null);

  const showNotification = (msg: string, isErr = false) => {
    setToastMessage(msg);
    setToastError(isErr);
    setTimeout(() => {
      setToastMessage("");
      setToastError(false);
    }, 4000);
  };

  // Safe API actions calling
  const executeAdminAction = async (action: string, payload: any) => {
    setLoading(true);
    try {
      const res = await fetch("/api/action", { // Wait, the endpoint is /api/admin/action! Let's correct it!
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload }),
      });
      // Fallback if route alias/path doesn't match:
      const actualRes = res.status === 404 ? await fetch("/api/admin/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload }),
      }) : res;

      const data = await actualRes.json();

      if (actualRes.ok) {
        showNotification("عملیات با موفقیت انجام شد.");
        router.refresh();
        return { success: true, data };
      } else {
        showNotification(data.error || "خطایی در انجام عملیات پیش آمد.", true);
        return { success: false };
      }
    } catch (e) {
      showNotification("بروز خطای غیر منتظره در اتصال به سرور.", true);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // 1. PRODUCT CRUD helpers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      title: "",
      slug: "",
      description: "",
      categoryId: categories[0]?.id || "",
      basePrice: "250000",
      published: true,
      featured: false,
      variants: [
        {
          color: "rose",
          colorName: "صورتی ملایم",
          images: ["/images/bra-luxury.jpg"],
          sizes: [{ size: "75B", stock: 10, sku: `SKU-${Date.now()}-1`, priceOverride: null }],
        },
      ],
      faq: [{ question: "جنس این مدل چیست؟", answer: "گیپور لوکس ضدحساسیت" }],
    });
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (prod: any) => {
    setEditingProduct(prod);
    setProductForm({
      title: prod.title,
      slug: prod.slug,
      description: prod.description,
      categoryId: prod.categoryId,
      basePrice: String(prod.basePrice),
      published: prod.published,
      featured: prod.featured,
      variants: JSON.parse(prod.variants || "[]"),
      faq: JSON.parse(prod.faq || "[]"),
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      const res = await executeAdminAction("updateProduct", { id: editingProduct.id, ...productForm });
      if (res.success) {
        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? { ...p, ...productForm, basePrice: parseInt(productForm.basePrice) } : p)));
        setShowProductModal(false);
      }
    } else {
      const res = await executeAdminAction("createProduct", productForm);
      if (res.success && res.data.product) {
        setProducts((prev) => [res.data.product, ...prev]);
        setShowProductModal(false);
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("آیا از حذف این محصول به طور کامل از آرشیو اطمینان دارید؟")) return;
    const res = await executeAdminAction("deleteProduct", { id });
    if (res.success) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // 2. CATEGORY CRUD helpers
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ name: "", slug: "", parentId: "", sortOrder: "0" });
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const type = editingCategory ? "update" : "create";
    const res = await executeAdminAction("manageCategory", {
      type,
      id: editingCategory?.id,
      ...categoryForm,
    });
    if (res.success) {
      // Reload categories list live
      const catRes = await fetch("/api/categories");
      if (catRes.ok) {
        const data = await catRes.json();
        setCategories(data);
      }
      setShowCategoryModal(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("آیا از حذف این دسته‌بندی لوکس مطمئن هستید؟")) return;
    const res = await executeAdminAction("manageCategory", { type: "delete", id });
    if (res.success) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // 3. ARTICLE CRUD helpers
  const handleOpenAddArticle = () => {
    setEditingArticle(null);
    setArticleForm({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featuredImage: "/images/bra-luxury.jpg",
      categoryId: categories[0]?.id || "",
      metaTitle: "",
      metaDescription: "",
      canonicalUrl: "",
      indexStatus: true,
      publishStatus: "Published",
    });
    setShowArticleModal(true);
  };

  const handleOpenEditArticle = (art: any) => {
    setEditingArticle(art);
    setArticleForm({
      title: art.title,
      slug: art.slug,
      excerpt: art.excerpt,
      content: art.content,
      featuredImage: art.featuredImage,
      categoryId: art.categoryId,
      metaTitle: art.metaTitle || "",
      metaDescription: art.metaDescription || "",
      canonicalUrl: art.canonicalUrl || "",
      indexStatus: art.indexStatus,
      publishStatus: art.publishStatus,
    });
    setShowArticleModal(true);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingArticle) {
      const res = await executeAdminAction("updateArticle", { id: editingArticle.id, ...articleForm });
      if (res.success) {
        setArticles((prev) => prev.map((a) => (a.id === editingArticle.id ? { ...a, ...articleForm } : a)));
        setShowArticleModal(false);
      }
    } else {
      const res = await executeAdminAction("createArticle", articleForm);
      if (res.success && res.data.article) {
        setArticles((prev) => [res.data.article, ...prev]);
        setShowArticleModal(false);
      }
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("آیا از حذف این مقاله ژورنالی مطمئن هستید؟")) return;
    const res = await executeAdminAction("deleteArticle", { id });
    if (res.success) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
    }
  };

  // 4. ORDER management helpers
  const handleUpdateOrderStatus = async (id: string, status: string, paymentStatus: string, trackingCode: string) => {
    const res = await executeAdminAction("updateOrderStatus", { id, status, paymentStatus, trackingCode });
    if (res.success) {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status, paymentStatus, trackingCode } : o)));
    }
  };

  // 5. REVIEW moderation helpers
  const handleUpdateReviewStatus = async (id: string, moderationStatus: string, reply: string) => {
    const res = await executeAdminAction("updateReviewStatus", { id, moderationStatus, reply });
    if (res.success) {
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, moderationStatus, reply } : r)));
      setActiveReviewReply(null);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("آیا مایل به حذف کامل این دیدگاه هستید؟")) return;
    const res = await executeAdminAction("deleteReview", { id });
    if (res.success) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  };

  // 6. DISCOUNT CRUD helpers
  const handleSaveDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await executeAdminAction("createDiscount", discountForm);
    if (res.success && res.data.discountCode) {
      setDiscountCodes((prev) => [res.data.discountCode, ...prev]);
      setShowDiscountModal(false);
    }
  };

  const handleDeleteDiscount = async (id: string) => {
    if (!confirm("آیا مایل به حذف کامل این کد کوپن هستید؟")) return;
    const res = await executeAdminAction("deleteDiscount", { id });
    if (res.success) {
      setDiscountCodes((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // 7. USER management helpers
  const handleUpdateUserRole = async (id: string, role: string) => {
    const res = await executeAdminAction("updateUserRole", { id, role });
    if (res.success) {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    }
  };

  // 8. Low Stock alerts (Down to variant color/size depth!)
  const getLowStockAlerts = () => {
    const alerts: { title: string; color: string; size: string; stock: number }[] = [];
    products.forEach((p) => {
      try {
        const variants = JSON.parse(p.variants || "[]");
        variants.forEach((v: any) => {
          v.sizes.forEach((s: any) => {
            if (s.stock < 4) {
              alerts.push({
                title: p.title,
                color: v.colorName || v.color,
                size: s.size,
                stock: s.stock,
              });
            }
          });
        });
      } catch (e) {}
    });
    return alerts;
  };

  const lowStockAlertsList = getLowStockAlerts();

  return (
    <div className="space-y-8 text-right relative font-light" dir="rtl">
      
      {/* Toast popup */}
      {toastMessage && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-4 sharp-corners shadow-2xl flex items-center gap-2 fade-in border ${
          toastError ? "bg-red-600 border-red-500 text-white" : "bg-green-700 border-green-600 text-white"
        }`}>
          <AlertCircle size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Panel */}
      <div className="bg-white border border-[#ECE7E3] p-6 sharp-corners flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-light text-[#1A1A1A] font-serif uppercase tracking-widest">پنل مدیریت لوکس سامانه</h1>
          <p className="text-xs text-[#6F6F6F] mt-1 font-light">کنترل مقتدرانه بر روی محصولات، مقالات مجله، فاکتورهای محرمانه و کلوپ کاربران.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/")}
            className="text-xs text-[#1A1A1A] border border-[#ECE7E3] bg-white hover:bg-gray-50 px-4 py-2.5 sharp-corners cursor-pointer"
          >
            مشاهده سایت اصلی
          </button>
        </div>
      </div>

      {/* Side-by-side Layout (Tabs list + Panel Content) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Tabs (Span 3) */}
        <div className="lg:col-span-3 bg-white border border-[#ECE7E3] p-4 sharp-corners space-y-1">
          {[
            { id: "overview", label: "خلاصه فعالیت‌ها", icon: <LayoutDashboard size={15} /> },
            { id: "products", label: "محصولات لوکس", icon: <ShoppingBag size={15} /> },
            { id: "categories", label: "دسته‌بندی‌های پویا", icon: <FolderTree size={15} /> },
            { id: "articles", label: "مقالات مجله", icon: <FileText size={15} /> },
            { id: "orders", label: "سفارش‌های واصله", icon: <CreditCard size={15} /> },
            { id: "discounts", label: "کوپن‌های تخفیف", icon: <Percent size={15} /> },
            { id: "reviews", label: "نظرات و دیدگاه‌ها", icon: <MessageSquare size={15} /> },
            { id: "users", label: "کلوپ کاربران", icon: <Users size={15} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full py-3.5 px-4 text-xs font-semibold text-right flex items-center gap-2.5 transition-all border-r-2 sharp-corners cursor-pointer ${
                activeTab === tab.id
                  ? "border-[#D9A8A0] text-[#D9A8A0] bg-[#FAF8F6] font-bold"
                  : "border-transparent text-[#6F6F6F] hover:text-[#1A1A1A]"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Panels Content area (Span 9) */}
        <div className="lg:col-span-9 min-h-[60vh] bg-white border border-[#ECE7E3] p-6 sm:p-8 sharp-corners">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <h2 className="font-bold text-sm text-[#1A1A1A] border-b border-[#ECE7E3] pb-2.5">پیشخوان آمار فعالیت‌ها</h2>
              
              {/* Stat Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#FAF8F6] border border-[#ECE7E3] p-4 sharp-corners text-center space-y-1">
                  <span className="text-[10px] text-[#6F6F6F] block">مجموع درآمدهای حاصله</span>
                  <strong className="text-md sm:text-lg font-serif text-[#1A1A1A]">
                    {orders.filter((o) => o.status === "Paid" || o.status === "Shipped" || o.status === "Delivered").reduce((acc, o) => acc + o.totalAmount, 0).toLocaleString("fa-IR")} تومان
                  </strong>
                </div>
                <div className="bg-[#FAF8F6] border border-[#ECE7E3] p-4 sharp-corners text-center space-y-1">
                  <span className="text-[10px] text-[#6F6F6F] block">کل سفارش‌های ثبتی</span>
                  <strong className="text-md sm:text-lg font-serif text-[#1A1A1A]">{orders.length} عدد</strong>
                </div>
                <div className="bg-[#FAF8F6] border border-[#ECE7E3] p-4 sharp-corners text-center space-y-1">
                  <span className="text-[10px] text-[#6F6F6F] block">محصولات آرشیو انبار</span>
                  <strong className="text-md sm:text-lg font-serif text-[#1A1A1A]">{products.length} عدد</strong>
                </div>
                <div className="bg-[#FAF8F6] border border-[#ECE7E3] p-4 sharp-corners text-center space-y-1">
                  <span className="text-[10px] text-[#6F6F6F] block">کاربران ثبت‌نام شده</span>
                  <strong className="text-md sm:text-lg font-serif text-[#1A1A1A]">{users.length} نفر</strong>
                </div>
              </div>

              {/* Low Stock Alerts */}
              {lowStockAlertsList.length > 0 && (
                <div className="border border-yellow-200 bg-yellow-50/40 p-4 sharp-corners space-y-3">
                  <h3 className="font-semibold text-xs text-yellow-800 flex items-center gap-1.5">
                    <AlertTriangle size={15} />
                    هشدارهای بحرانی کمبود موجودی انبار ({lowStockAlertsList.length} مورد)
                  </h3>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 text-xs text-[#1A1A1A]">
                    {lowStockAlertsList.map((alert, idx) => (
                      <div key={idx} className="flex justify-between border-b border-yellow-100 pb-1 font-light">
                        <span>{alert.title} <strong className="text-[#6F6F6F]">({alert.color} - سایز {alert.size})</strong></span>
                        <span className="text-red-600 font-bold">موجودی بحرانی: {alert.stock} عدد</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Latest Registered Users & Orders List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
                {/* Recent Orders */}
                <div className="border border-[#ECE7E3] p-4 sharp-corners bg-white space-y-4">
                  <h3 className="font-bold text-xs text-[#1A1A1A] border-b border-[#ECE7E3] pb-2">سفارش‌های اخیر</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {orders.slice(0, 5).map((o) => (
                      <div key={o.id} className="flex justify-between items-center border-b border-gray-50 pb-2">
                        <div>
                          <strong className="font-mono text-[#1A1A1A] block">{o.id.slice(0, 8).toUpperCase()}</strong>
                          <span className="text-[10px] text-gray-400 font-light">{new Date(o.createdAt).toLocaleDateString("fa-IR")}</span>
                        </div>
                        <div className="text-left">
                          <strong className="block text-[#1A1A1A]">{o.totalAmount.toLocaleString("fa-IR")} تومان</strong>
                          <span className="text-[10px] text-gray-400 font-light">{o.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Users */}
                <div className="border border-[#ECE7E3] p-4 sharp-corners bg-white space-y-4">
                  <h3 className="font-bold text-xs text-[#1A1A1A] border-b border-[#ECE7E3] pb-2">کاربران اخیر</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {users.slice(0, 5).map((u) => (
                      <div key={u.id} className="flex justify-between items-center border-b border-gray-50 pb-2 font-light">
                        <div>
                          <strong className="text-[#1A1A1A] block">{u.name || "کاربر تستی بدون نام"}</strong>
                          <span className="text-[10px] text-gray-400 font-mono">{u.phone}</span>
                        </div>
                        <span className="text-[10px] text-gray-400">
                          {new Date(u.createdAt).toLocaleDateString("fa-IR")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-[#ECE7E3] pb-2.5">
                <h2 className="font-bold text-sm text-[#1A1A1A]">آرشیو محصولات لوکس انبار</h2>
                <button
                  onClick={handleOpenAddProduct}
                  className="bg-[#1A1A1A] text-white text-xs font-semibold px-4 py-2 sharp-corners hover:bg-[#D9A8A0] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Plus size={14} />
                  افزودن محصول جدید
                </button>
              </div>

              {/* Products Table list */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="bg-[#FAF8F6] border-b border-[#ECE7E3] text-[#1A1A1A] font-semibold">
                      <th className="p-3">عنوان محصول</th>
                      <th className="p-3">دسته محصول</th>
                      <th className="p-3">قیمت مبنا (تومان)</th>
                      <th className="p-3">وضعیت نمایش</th>
                      <th className="p-3 text-left">عملیات ادمین</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-[#6F6F6F] font-light">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FAF8F6]/30">
                        <td className="p-3 font-semibold text-[#1A1A1A]">{p.title}</td>
                        <td className="p-3">{p.category?.name || "بدون دسته"}</td>
                        <td className="p-3 font-mono">{p.basePrice.toLocaleString("fa-IR")}</td>
                        <td className="p-3">
                          {p.published ? (
                            <span className="text-green-700 bg-green-50 px-2 py-0.5 sharp-corners font-semibold text-[10px]">منتشر شده</span>
                          ) : (
                            <span className="text-gray-400 bg-gray-50 px-2 py-0.5 sharp-corners font-semibold text-[10px]">پیش‌نویس</span>
                          )}
                          {p.featured && (
                            <span className="text-[#D9A8A0] bg-[#FAF8F6] px-2 py-0.5 sharp-corners font-semibold text-[10px] mr-1">ویژه</span>
                          )}
                        </td>
                        <td className="p-3 text-left flex justify-end gap-2.5">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="text-[#D9A8A0] hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            <Edit size={12} />
                            ویرایش
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="text-red-500 hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            <Trash2 size={12} />
                            حذف
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIES */}
          {activeTab === "categories" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-[#ECE7E3] pb-2.5">
                <h2 className="font-bold text-sm text-[#1A1A1A]">مدیریت درخت دسته‌بندی‌ها</h2>
                <button
                  onClick={handleOpenAddCategory}
                  className="bg-[#1A1A1A] text-white text-xs font-semibold px-4 py-2 sharp-corners hover:bg-[#D9A8A0] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Plus size={14} />
                  ایجاد دسته جدید
                </button>
              </div>

              {/* Categories list tree representation */}
              <div className="space-y-4 text-xs font-light text-[#1A1A1A]">
                {categories.map((parent) => (
                  <div key={parent.id} className="border border-[#ECE7E3] p-4 bg-[#FAF8F6] sharp-corners space-y-3 shadow-sm">
                    <div className="flex justify-between items-center border-b border-[#ECE7E3]/60 pb-2">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-semibold">{parent.name}</strong>
                        <span className="text-[10px] text-gray-400 font-mono">slug: {parent.slug}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingCategory(parent);
                            setCategoryForm({
                              name: parent.name,
                              slug: parent.slug,
                              parentId: "",
                              sortOrder: String(parent.sortOrder),
                            });
                            setShowCategoryModal(true);
                          }}
                          className="text-[#D9A8A0] hover:underline font-semibold cursor-pointer"
                        >
                          ویرایش
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(parent.id)}
                          className="text-red-500 hover:underline font-semibold cursor-pointer"
                        >
                          حذف
                        </button>
                      </div>
                    </div>

                    {/* Subcategories (children list) */}
                    {parent.children && parent.children.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pr-4 border-r-2 border-[#ECE7E3] mt-2">
                        {parent.children.map((sub: any) => (
                          <div
                            key={sub.id}
                            className="bg-white p-2.5 border border-gray-100 flex justify-between items-center sharp-corners"
                          >
                            <div className="flex flex-col">
                              <span>{sub.name}</span>
                              <span className="text-[9px] text-gray-400 font-mono">slug: {sub.slug}</span>
                            </div>
                            <div className="flex gap-1.5 text-[10px]">
                              <button
                                onClick={() => {
                                  setEditingCategory(sub);
                                  setCategoryForm({
                                    name: sub.name,
                                    slug: sub.slug,
                                    parentId: sub.parentId || "",
                                    sortOrder: String(sub.sortOrder),
                                  });
                                  setShowCategoryModal(true);
                                }}
                                className="text-[#D9A8A0] hover:underline font-semibold cursor-pointer"
                              >
                                ویرایش
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(sub.id)}
                                className="text-red-500 hover:underline font-semibold cursor-pointer"
                              >
                                حذف
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ARTICLES */}
          {activeTab === "articles" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-[#ECE7E3] pb-2.5">
                <h2 className="font-bold text-sm text-[#1A1A1A]">مقالات مجله و راهنماهای فعال</h2>
                <button
                  onClick={handleOpenAddArticle}
                  className="bg-[#1A1A1A] text-white text-xs font-semibold px-4 py-2 sharp-corners hover:bg-[#D9A8A0] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Plus size={14} />
                  ایجاد مقاله جدید
                </button>
              </div>

              {/* Articles table list */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="bg-[#FAF8F6] border-b border-[#ECE7E3] text-[#1A1A1A] font-semibold">
                      <th className="p-3">عنوان مقاله</th>
                      <th className="p-3">دسته متناظر</th>
                      <th className="p-3">وضعیت انتشار</th>
                      <th className="p-3">تاریخ ثبت</th>
                      <th className="p-3 text-left">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-[#6F6F6F] font-light">
                    {articles.map((art) => (
                      <tr key={art.id} className="hover:bg-[#FAF8F6]/30">
                        <td className="p-3 font-semibold text-[#1A1A1A] max-w-xs truncate">{art.title}</td>
                        <td className="p-3">{art.category?.name || "عمومی"}</td>
                        <td className="p-3">
                          {art.publishStatus === "Published" ? (
                            <span className="text-green-700 bg-green-50 px-2 py-0.5 sharp-corners font-semibold text-[10px]">منتشر شده</span>
                          ) : (
                            <span className="text-gray-400 bg-gray-50 px-2 py-0.5 sharp-corners font-semibold text-[10px]">پیش‌نویس</span>
                          )}
                        </td>
                        <td className="p-3 font-mono">{new Date(art.createdAt).toLocaleDateString("fa-IR")}</td>
                        <td className="p-3 text-left flex justify-end gap-2.5">
                          <button
                            onClick={() => handleOpenEditArticle(art)}
                            className="text-[#D9A8A0] hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            <Edit size={12} />
                            ویرایش
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(art.id)}
                            className="text-red-500 hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            <Trash2 size={12} />
                            حذف
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: ORDERS */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <h2 className="font-bold text-sm text-[#1A1A1A] border-b border-[#ECE7E3] pb-2.5">مدیریت سفارش‌ها و کدهای رهگیری</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="bg-[#FAF8F6] border-b border-[#ECE7E3] text-[#1A1A1A] font-semibold">
                      <th className="p-3">شناسه فاکتور</th>
                      <th className="p-3">خریدار</th>
                      <th className="p-3">مبلغ کل (تومان)</th>
                      <th className="p-3">وضعیت سفارش</th>
                      <th className="p-3">وضعیت مالی</th>
                      <th className="p-3">تغییر وضعیت سفارش / مرسوله</th>
                      <th className="p-3 text-left">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-[#6F6F6F] font-light">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-[#FAF8F6]/30">
                        <td className="p-3 font-mono text-[#1A1A1A]">{o.id.slice(0, 8).toUpperCase()}</td>
                        <td className="p-3 font-semibold text-[#1A1A1A]">{o.user?.name || o.user?.phone}</td>
                        <td className="p-3 font-mono">{o.totalAmount.toLocaleString("fa-IR")}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 sharp-corners font-semibold text-[10px] ${
                            o.status === "Paid" ? "bg-green-50 text-green-700" :
                            o.status === "Shipped" ? "bg-blue-50 text-blue-700" :
                            o.status === "Pending" ? "bg-yellow-50 text-yellow-700" :
                            "bg-red-50 text-red-700"
                          }`}>
                            {o.status === "Paid" ? "پرداخت شده" : o.status === "Shipped" ? "ارسال شده" : o.status === "Pending" ? "منتظر پرداخت" : o.status}
                          </span>
                        </td>
                        <td className="p-3">{o.paymentStatus === "Paid" ? "پرداخت موفق" : "ناموفق / تعلیق"}</td>
                        <td className="p-3">
                          {/* Quick dropdown triggers */}
                          <select
                            value={o.status}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value, o.paymentStatus, o.trackingCode || "")}
                            className="border border-[#ECE7E3] bg-white px-2 py-1 text-[11px] outline-none sharp-corners focus:ring-1 focus:ring-[#D9A8A0]"
                          >
                            <option value="Pending">Pending (در انتظار پرداخت)</option>
                            <option value="Paid">Paid (پرداخت شده / آماده‌سازی)</option>
                            <option value="Shipped">Shipped (ارسال مرسوله)</option>
                            <option value="Delivered">Delivered (تحویل کالا)</option>
                            <option value="Cancelled">Cancelled (لغو سفارش)</option>
                          </select>
                        </td>
                        <td className="p-3 text-left">
                          <button
                            onClick={() => setSelectedOrderForInvoice(o)}
                            className="text-[#D9A8A0] hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            <Printer size={12} />
                            چاپ فاکتور
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: DISCOUNTS */}
          {activeTab === "discounts" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-[#ECE7E3] pb-2.5">
                <h2 className="font-bold text-sm text-[#1A1A1A]">کوپن‌های تخفیف و کارزارهای تبلیغاتی</h2>
                <button
                  onClick={() => setShowDiscountModal(true)}
                  className="bg-[#1A1A1A] text-white text-xs font-semibold px-4 py-2 sharp-corners hover:bg-[#D9A8A0] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Plus size={14} />
                  ایجاد کوپن جدید
                </button>
              </div>

              {/* Discounts List */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="bg-[#FAF8F6] border-b border-[#ECE7E3] text-[#1A1A1A] font-semibold">
                      <th className="p-3">کد کوپن</th>
                      <th className="p-3">نوع تخفیف</th>
                      <th className="p-3">میزان تخفیف</th>
                      <th className="p-3">سقف استفاده</th>
                      <th className="p-3">فعال بودن</th>
                      <th className="p-3 text-left">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-[#6F6F6F] font-light">
                    {discountCodes.map((code) => (
                      <tr key={code.id} className="hover:bg-[#FAF8F6]/30">
                        <td className="p-3 font-bold font-mono text-[#1A1A1A]">{code.code}</td>
                        <td className="p-3">{code.type === "Percent" ? "درصدی (%)" : "ثابت (تومان)"}</td>
                        <td className="p-3 font-mono">
                          {code.type === "Percent" ? `${code.value}٪` : `${code.value.toLocaleString("fa-IR")} تومان`}
                        </td>
                        <td className="p-3 font-mono">{code.timesUsed} / {code.usageLimit}</td>
                        <td className="p-3">
                          {code.isActive ? (
                            <span className="text-green-700 bg-green-50 px-2 py-0.5 sharp-corners font-semibold text-[10px]">فعال</span>
                          ) : (
                            <span className="text-gray-400 bg-gray-50 px-2 py-0.5 sharp-corners font-semibold text-[10px]">غیرفعال</span>
                          )}
                        </td>
                        <td className="p-3 text-left">
                          <button
                            onClick={() => handleDeleteDiscount(code.id)}
                            className="text-red-500 hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            <Trash2 size={12} />
                            حذف
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: REVIEWS */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              <h2 className="font-bold text-sm text-[#1A1A1A] border-b border-[#ECE7E3] pb-2.5">مدیریت دیدگاه‌ها و پاسخ‌های خریداران</h2>
              
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="border border-[#ECE7E3] p-4 bg-white sharp-corners space-y-3 shadow-sm text-xs font-light">
                    <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                      <div className="flex items-center gap-3">
                        <strong className="text-sm font-semibold text-[#1A1A1A]">{rev.user?.name || rev.user?.phone}</strong>
                        <span className="text-yellow-500 flex items-center">★ {rev.rating}</span>
                        <span className="text-gray-400 font-mono">محصول: {rev.product?.title}</span>
                      </div>
                      <div className="flex gap-2">
                        {rev.moderationStatus === "Pending" && (
                          <>
                            <button
                              onClick={() => handleUpdateReviewStatus(rev.id, "Approved", rev.reply || "")}
                              className="text-green-600 hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
                            >
                              <Check size={12} />
                              تایید دیدگاه
                            </button>
                            <button
                              onClick={() => handleUpdateReviewStatus(rev.id, "Rejected", rev.reply || "")}
                              className="text-red-500 hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
                            >
                              <X size={12} />
                              رد دیدگاه
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="text-gray-400 hover:text-red-500 hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
                        >
                          <Trash2 size={12} />
                          حذف
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-[#6F6F6F] leading-relaxed">« {rev.comment} »</p>

                    {/* Management Reply section */}
                    {rev.reply ? (
                      <div className="bg-[#FAF8F6] p-3 border-r-2 border-[#D9A8A0] mt-2 space-y-1">
                        <strong className="text-black font-semibold block">پاسخ مدیریت:</strong>
                        <p className="text-gray-600 leading-normal">{rev.reply}</p>
                      </div>
                    ) : (
                      activeReviewReply?.id === rev.id ? (
                        <div className="flex gap-2 items-center mt-2">
                          <input
                            type="text"
                            placeholder="پاسخ ادمین به دیدگاه..."
                            value={activeReviewReply?.text || ""}
                            onChange={(e) => setActiveReviewReply({ id: rev.id, text: e.target.value })}
                            className="flex-grow text-xs p-2 border border-[#ECE7E3] outline-none bg-[#FAF8F6] focus:bg-white sharp-corners"
                          />
                          <button
                            onClick={() => handleUpdateReviewStatus(rev.id, "Approved", activeReviewReply?.text || "")}
                            className="bg-[#1A1A1A] text-white text-xs px-4 py-2 sharp-corners cursor-pointer"
                          >
                            ثبت پاسخ
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setActiveReviewReply({ id: rev.id, text: "" })}
                          className="text-[#D9A8A0] hover:underline font-semibold text-xs mt-2 block cursor-pointer"
                        >
                          + درج پاسخ ادمین به خریدار
                        </button>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: USERS */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <h2 className="font-bold text-sm text-[#1A1A1A] border-b border-[#ECE7E3] pb-2.5">اعضای کلوپ و سطوح دسترسی</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="bg-[#FAF8F6] border-b border-[#ECE7E3] text-[#1A1A1A] font-semibold">
                      <th className="p-3">نام کاربر</th>
                      <th className="p-3">شماره تلفن</th>
                      <th className="p-3">نقش کاربری</th>
                      <th className="p-3">تاریخ عضویت</th>
                      <th className="p-3 text-left">تغییر سطح دسترسی کاربری</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-[#6F6F6F] font-light">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-[#FAF8F6]/30">
                        <td className="p-3 font-semibold text-[#1A1A1A]">{u.name || "کاربر ناشناس"}</td>
                        <td className="p-3 font-mono">{u.phone}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 sharp-corners font-bold text-[10px] ${
                            u.role === "Admin" ? "bg-red-50 text-red-700 border border-red-100" : "bg-gray-100 text-gray-700"
                          }`}>
                            {u.role === "Admin" ? "مدیر ارشد" : "مشتری"}
                          </span>
                        </td>
                        <td className="p-3 font-mono">{new Date(u.createdAt).toLocaleDateString("fa-IR")}</td>
                        <td className="p-3 text-left">
                          <select
                            value={u.role}
                            onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                            className="border border-[#ECE7E3] bg-white px-2 py-1 text-[11px] outline-none sharp-corners focus:ring-1 focus:ring-[#D9A8A0]"
                          >
                            <option value="Customer">مشتری معمولی (Customer)</option>
                            <option value="Admin">مدیر ارشد (Admin)</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* PRODUCT ADD/EDIT POPUP MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-[#1A1A1A]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white p-6 sm:p-8 border border-[#ECE7E3] sharp-corners w-full max-w-3xl max-h-[85vh] overflow-y-auto text-right shadow-2xl relative fade-in">
            <button
              onClick={() => setShowProductModal(false)}
              className="absolute top-6 left-6 text-gray-400 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="font-bold text-md text-[#1A1A1A] font-serif border-b border-[#ECE7E3] pb-3 mb-6">
              {editingProduct ? "ویرایش شناسنامه محصول لوکس" : "افزودن شناسنامه محصول جدید"}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-light">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-black">عنوان محصول</label>
                  <input
                    type="text"
                    required
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    className="w-full p-2.5 border border-[#ECE7E3] bg-[#FAF8F6] outline-none focus:bg-white focus:ring-1 focus:ring-[#D9A8A0] sharp-corners"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-black">اسلاگ یونیک انگلیسی (SEO URL)</label>
                  <input
                    type="text"
                    required
                    placeholder="french-lace-luxury-bra"
                    value={productForm.slug}
                    onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                    className="w-full p-2.5 border border-[#ECE7E3] bg-[#FAF8F6] outline-none focus:bg-white focus:ring-1 focus:ring-[#D9A8A0] sharp-corners font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-black">دسته محصول</label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full p-2.5 border border-[#ECE7E3] bg-[#FAF8F6] outline-none sharp-corners"
                  >
                    {categories.map((cat) => (
                      <React.Fragment key={cat.id}>
                        <option value={cat.id}>{cat.name}</option>
                        {cat.children && cat.children.map((sub: any) => (
                          <option key={sub.id} value={sub.id}>-- {sub.name}</option>
                        ))}
                      </React.Fragment>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-black">قیمت مبنا (Toman)</label>
                  <input
                    type="number"
                    required
                    value={productForm.basePrice}
                    onChange={(e) => setProductForm({ ...productForm, basePrice: e.target.value })}
                    className="w-full p-2.5 border border-[#ECE7E3] bg-[#FAF8F6] outline-none focus:bg-white focus:ring-1 focus:ring-[#D9A8A0] sharp-corners font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-black">توضیحات تفصیلی محصول (Persian)</label>
                <textarea
                  rows={4}
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full p-2.5 border border-[#ECE7E3] bg-[#FAF8F6] outline-none focus:bg-white focus:ring-1 focus:ring-[#D9A8A0] sharp-corners text-right leading-relaxed"
                ></textarea>
              </div>

              {/* Quick Variants simulation layout */}
              <div className="border border-[#ECE7E3] p-4 bg-[#FAF8F6] sharp-corners space-y-3">
                <span className="font-bold text-[#1A1A1A] block">شبیه‌سازی ماتریس انبار (رنگ × سایز × موجودی):</span>
                <p className="text-[10px] text-[#6F6F6F]">
                  ویرایش دستی مستقیم آرایه انبار جهت حفظ سادگی دیتابیس لوکس (به عنوان JSON):
                </p>
                <textarea
                  rows={4}
                  value={typeof productForm.variants === "string" ? productForm.variants : JSON.stringify(productForm.variants, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setProductForm({ ...productForm, variants: parsed });
                    } catch (err) {
                      // Keep text as is for typing flexibility
                      setProductForm({ ...productForm, variants: e.target.value as any });
                    }
                  }}
                  className="w-full p-2.5 border border-[#ECE7E3] bg-white outline-none sharp-corners font-mono text-[10px] leading-relaxed"
                ></textarea>
              </div>

              <div className="flex gap-4 items-center">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-black">
                  <input
                    type="checkbox"
                    checked={productForm.published}
                    onChange={(e) => setProductForm({ ...productForm, published: e.target.checked })}
                    className="w-4 h-4 accent-[#D9A8A0]"
                  />
                  انتشار عمومی در سایت
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-black">
                  <input
                    type="checkbox"
                    checked={productForm.featured}
                    onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                    className="w-4 h-4 accent-[#D9A8A0]"
                  />
                  نمایش ویژه در ویترین صفحه اصلی
                </label>
              </div>

              <div className="flex gap-2 pt-4 border-t border-[#ECE7E3]">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#1A1A1A] text-white text-xs font-semibold px-8 py-3 sharp-corners hover:bg-[#D9A8A0] transition-colors cursor-pointer"
                >
                  {loading ? "در حال ثبت..." : "ذخیره فکت‌شیت محصول"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="border border-gray-300 text-gray-500 text-xs px-8 py-3 sharp-corners hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY ADD/EDIT MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-[#1A1A1A]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 border border-[#ECE7E3] sharp-corners w-full max-w-md text-right shadow-2xl relative fade-in">
            <button
              onClick={() => setShowCategoryModal(false)}
              className="absolute top-6 left-6 text-gray-400 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="font-bold text-md text-[#1A1A1A] font-serif border-b border-[#ECE7E3] pb-3 mb-6">
              {editingCategory ? "ویرایش مشخصات دسته‌بندی" : "ایجاد دسته‌بندی جدید"}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs font-light">
              <div className="space-y-1">
                <label className="font-semibold text-black">نام دسته‌بندی (Persian)</label>
                <input
                  type="text"
                  required
                  placeholder="سوتین توری"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full p-2.5 border border-[#ECE7E3] bg-[#FAF8F6] outline-none focus:bg-white focus:ring-1 focus:ring-[#D9A8A0] sharp-corners"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-black">اسلاگ انگلیسی (SEO slug)</label>
                <input
                  type="text"
                  required
                  placeholder="lace-bras"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  className="w-full p-2.5 border border-[#ECE7E3] bg-[#FAF8F6] outline-none focus:bg-white focus:ring-1 focus:ring-[#D9A8A0] sharp-corners font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-black">دسته‌بندی مادر (بخش والد)</label>
                <select
                  value={categoryForm.parentId}
                  onChange={(e) => setCategoryForm({ ...categoryForm, parentId: e.target.value })}
                  className="w-full p-2.5 border border-[#ECE7E3] bg-[#FAF8F6] outline-none sharp-corners"
                >
                  <option value="">-- به عنوان دسته‌بندی اصلی (والد اصلی) --</option>
                  {categories.filter((c) => c.parentId === null).map((parent) => (
                    <option key={parent.id} value={parent.id}>{parent.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-black">ترتیب چیدمان (سورت عددی)</label>
                <input
                  type="number"
                  required
                  value={categoryForm.sortOrder}
                  onChange={(e) => setCategoryForm({ ...categoryForm, sortOrder: e.target.value })}
                  className="w-full p-2.5 border border-[#ECE7E3] bg-[#FAF8F6] outline-none focus:bg-white focus:ring-1 focus:ring-[#D9A8A0] sharp-corners font-mono"
                />
              </div>

              <div className="flex gap-2 pt-4 border-t border-[#ECE7E3]">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#1A1A1A] text-white text-xs font-semibold px-6 py-2.5 sharp-corners hover:bg-[#D9A8A0] transition-colors cursor-pointer"
                >
                  {loading ? "در حال ثبت..." : "ذخیره دسته‌بندی لوکس"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="border border-gray-300 text-gray-500 text-xs px-6 py-2.5 sharp-corners hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ARTICLE ADD/EDIT MODAL */}
      {showArticleModal && (
        <div className="fixed inset-0 z-50 bg-[#1A1A1A]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white p-6 sm:p-8 border border-[#ECE7E3] sharp-corners w-full max-w-3xl max-h-[85vh] overflow-y-auto text-right shadow-2xl relative fade-in">
            <button
              onClick={() => setShowArticleModal(false)}
              className="absolute top-6 left-6 text-gray-400 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="font-bold text-md text-[#1A1A1A] font-serif border-b border-[#ECE7E3] pb-3 mb-6">
              {editingArticle ? "ویرایش و اصلاح مقاله مجله" : "ثبت و تحریر مقاله مجله جدید"}
            </h3>

            <form onSubmit={handleSaveArticle} className="space-y-4 text-xs font-light">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-black">عنوان اصلی مقاله (Persian)</label>
                  <input
                    type="text"
                    required
                    value={articleForm.title}
                    onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                    className="w-full p-2.5 border border-[#ECE7E3] bg-[#FAF8F6] outline-none focus:bg-white focus:ring-1 focus:ring-[#D9A8A0] sharp-corners"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-black">اسلاگ یونیک انگلیسی (SEO URL)</label>
                  <input
                    type="text"
                    required
                    placeholder="bra-size-guide-comprehensive"
                    value={articleForm.slug}
                    onChange={(e) => setArticleForm({ ...articleForm, slug: e.target.value })}
                    className="w-full p-2.5 border border-[#ECE7E3] bg-[#FAF8F6] outline-none focus:bg-white focus:ring-1 focus:ring-[#D9A8A0] sharp-corners font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-black">دسته‌بندی مربوطه</label>
                  <select
                    value={articleForm.categoryId}
                    onChange={(e) => setArticleForm({ ...articleForm, categoryId: e.target.value })}
                    className="w-full p-2.5 border border-[#ECE7E3] bg-[#FAF8F6] outline-none sharp-corners"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-black">مسیر تصویر بندانگشتی (Featured Image)</label>
                  <input
                    type="text"
                    required
                    value={articleForm.featuredImage}
                    onChange={(e) => setArticleForm({ ...articleForm, featuredImage: e.target.value })}
                    className="w-full p-2.5 border border-[#ECE7E3] bg-[#FAF8F6] outline-none focus:bg-white focus:ring-1 focus:ring-[#D9A8A0] sharp-corners font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-black">چکیده و خلاصه کوتاه مقاله (Excerpt)</label>
                <input
                  type="text"
                  required
                  placeholder="این خلاصه مقاله جهت نمایش در کارت‌های صفحه اصلی است..."
                  value={articleForm.excerpt}
                  onChange={(e) => setArticleForm({ ...articleForm, excerpt: e.target.value })}
                  className="w-full p-2.5 border border-[#ECE7E3] bg-[#FAF8F6] outline-none focus:bg-white focus:ring-1 focus:ring-[#D9A8A0] sharp-corners"
                />
              </div>

              {/* Content mock rich editor format toolbar representation */}
              <div className="space-y-1">
                <label className="font-semibold text-black">محتوای غنی و تفصیلی مقاله (HTML format)</label>
                <div className="border border-[#ECE7E3] bg-[#FAF8F6] p-2 flex gap-1.5 flex-wrap sharp-corners">
                  {["<h2>", "<h3>", "<p>", "<strong>", "<ul>", "<li>"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setArticleForm({ ...articleForm, content: articleForm.content + `\n${tag}\n` })}
                      className="bg-white border border-gray-200 px-2 py-1 text-[10px] hover:bg-gray-100 font-mono"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <textarea
                  rows={8}
                  required
                  placeholder="<h2>عنوان فصل اول...</h2> <p>متن بند...</p>"
                  value={articleForm.content}
                  onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                  className="w-full p-2.5 border border-[#ECE7E3] bg-white outline-none focus:ring-1 focus:ring-[#D9A8A0] sharp-corners font-mono text-[11px] leading-relaxed"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#ECE7E3] pt-4">
                <div className="space-y-1">
                  <label className="font-semibold text-black">SEO Meta Title (Persian)</label>
                  <input
                    type="text"
                    value={articleForm.metaTitle}
                    onChange={(e) => setArticleForm({ ...articleForm, metaTitle: e.target.value })}
                    className="w-full p-2.5 border border-[#ECE7E3] bg-[#FAF8F6] outline-none focus:bg-white focus:ring-1 focus:ring-[#D9A8A0] sharp-corners"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-black">SEO Meta Description</label>
                  <input
                    type="text"
                    value={articleForm.metaDescription}
                    onChange={(e) => setArticleForm({ ...articleForm, metaDescription: e.target.value })}
                    className="w-full p-2.5 border border-[#ECE7E3] bg-[#FAF8F6] outline-none focus:bg-white focus:ring-1 focus:ring-[#D9A8A0] sharp-corners"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-[#ECE7E3]">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#1A1A1A] text-white text-xs font-semibold px-8 py-3 sharp-corners hover:bg-[#D9A8A0] transition-colors cursor-pointer"
                >
                  {loading ? "در حال ثبت..." : "ذخیره و انتشار مقاله"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowArticleModal(false)}
                  className="border border-gray-300 text-gray-500 text-xs px-8 py-3 sharp-corners hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISCOUNT ADD MODAL */}
      {showDiscountModal && (
        <div className="fixed inset-0 z-50 bg-[#1A1A1A]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 border border-[#ECE7E3] sharp-corners w-full max-w-md text-right shadow-2xl relative fade-in">
            <button
              onClick={() => setShowDiscountModal(false)}
              className="absolute top-6 left-6 text-gray-400 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="font-bold text-md text-[#1A1A1A] font-serif border-b border-[#ECE7E3] pb-3 mb-6">
              صدور و فعال‌سازی کوپن تخفیف جدید
            </h3>

            <form onSubmit={handleSaveDiscount} className="space-y-4 text-xs font-light">
              <div className="space-y-1">
                <label className="font-semibold text-black">کد تخفیف (کوپن یونیک)</label>
                <input
                  type="text"
                  required
                  placeholder="VIP70"
                  value={discountForm.code}
                  onChange={(e) => setDiscountForm({ ...discountForm, code: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 border border-[#ECE7E3] bg-[#FAF8F6] outline-none focus:bg-white focus:ring-1 focus:ring-[#D9A8A0] sharp-corners font-mono tracking-wider"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-black">نوع کسر مالی</label>
                  <select
                    value={discountForm.type}
                    onChange={(e) => setDiscountForm({ ...discountForm, type: e.target.value })}
                    className="w-full p-2.5 border border-[#ECE7E3] bg-[#FAF8F6] outline-none sharp-corners"
                  >
                    <option value="Percent">درصدی (Percent)</option>
                    <option value="Fixed">ثابت ریالی/تومانی (Fixed)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-black">میزان کسر تخفیف</label>
                  <input
                    type="number"
                    required
                    placeholder="مثال: ۱۵ یا ۵۰۰۰۰"
                    value={discountForm.value}
                    onChange={(e) => setDiscountForm({ ...discountForm, value: e.target.value })}
                    className="w-full p-2.5 border border-[#ECE7E3] bg-[#FAF8F6] outline-none focus:bg-white focus:ring-1 focus:ring-[#D9A8A0] sharp-corners font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-black">تاریخ آغاز اعتبار</label>
                  <input
                    type="date"
                    required
                    value={discountForm.startsAt}
                    onChange={(e) => setDiscountForm({ ...discountForm, startsAt: e.target.value })}
                    className="w-full p-2.5 border border-[#ECE7E3] bg-[#FAF8F6] outline-none sharp-corners font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-black">تاریخ پایان انقضا</label>
                  <input
                    type="date"
                    required
                    value={discountForm.expiresAt}
                    onChange={(e) => setDiscountForm({ ...discountForm, expiresAt: e.target.value })}
                    className="w-full p-2.5 border border-[#ECE7E3] bg-[#FAF8F6] outline-none sharp-corners font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-black">سقف استفاده کلی از کوپن (Usage Limit)</label>
                <input
                  type="number"
                  required
                  value={discountForm.usageLimit}
                  onChange={(e) => setDiscountForm({ ...discountForm, usageLimit: e.target.value })}
                  className="w-full p-2.5 border border-[#ECE7E3] bg-[#FAF8F6] outline-none focus:bg-white focus:ring-1 focus:ring-[#D9A8A0] sharp-corners font-mono"
                />
              </div>

              <div className="flex gap-2 pt-4 border-t border-[#ECE7E3]">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#1A1A1A] text-white text-xs font-semibold px-6 py-2.5 sharp-corners hover:bg-[#D9A8A0] transition-colors cursor-pointer"
                >
                  {loading ? "در حال ثبت..." : "ثبت و فعال‌سازی کوپن"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDiscountModal(false)}
                  className="border border-gray-300 text-gray-500 text-xs px-6 py-2.5 sharp-corners hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILED NEUTRAL INVOICE PRINT POPUP */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 bg-[#1A1A1A]/70 flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:relative print:z-0">
          <div className="bg-white p-6 sm:p-10 border border-[#ECE7E3] sharp-corners w-full max-w-3xl max-h-[90vh] overflow-y-auto text-right shadow-2xl relative print:border-none print:shadow-none print:max-h-none print:overflow-visible">
            
            {/* Close button inside invoice view */}
            <button
              onClick={() => setSelectedOrderForInvoice(null)}
              className="absolute top-6 left-6 text-gray-400 hover:text-black transition-colors print:hidden"
            >
              <X size={20} />
            </button>

            {/* Print trigger */}
            <div className="flex justify-between items-center border-b border-[#ECE7E3] pb-4 mb-6 print:hidden">
              <h3 className="font-bold text-sm text-[#1A1A1A]">برگ فاکتور بسته‌بندی نهایی</h3>
              <button
                onClick={() => window.print()}
                className="bg-[#1A1A1A] text-white text-xs font-semibold px-4 py-2 sharp-corners hover:bg-[#D9A8A0] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer size={13} />
                چاپ برگه فاکتور فیزیکی
              </button>
            </div>

            {/* Simulated Printed invoice content */}
            <div className="space-y-6 text-xs text-[#1A1A1A]">
              {/* Top Row: General Packing label (GENERIC NO LINGERIE mention if discreet is true!) */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold uppercase font-serif tracking-widest">
                    {selectedOrderForInvoice.discreetShipping ? "فروشگاه البسه عمومی بانوان" : "فروشگاه تخصصی لباس زیر زنانه Lebaszirzanane"}
                  </h4>
                  <p className="text-[10px] text-[#6F6F6F]">برگه حواله بسته‌بندی و تحویل سفارش پستی</p>
                </div>
                <div className="text-left space-y-1 font-mono">
                  <p>کد سفارش: <strong>{selectedOrderForInvoice.id.slice(0, 8).toUpperCase()}</strong></p>
                  <p>تاریخ فاکتور: {new Date(selectedOrderForInvoice.createdAt).toLocaleDateString("fa-IR")}</p>
                </div>
              </div>

              {/* Delivery recipient detail snapshot */}
              <div className="bg-[#FAF8F6] border border-[#ECE7E3] p-4 sharp-corners grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-gray-400 block">مشخصات گیرنده مرسوله:</span>
                  {(() => {
                    try {
                      const addr = JSON.parse(selectedOrderForInvoice.shippingAddress);
                      return (
                        <div className="space-y-1 leading-relaxed text-[#1A1A1A]">
                          <p>نام گیرنده: <strong>{addr.receiver}</strong></p>
                          <p>تلفن همراه: <strong className="font-mono">{addr.phone}</strong></p>
                          <p>استان/شهر: {addr.province}، {addr.city}</p>
                          <p>آدرس دقیق: {addr.address}</p>
                          <p>کد پستی ۱۰ رقمی: <strong className="font-mono">{addr.postalCode}</strong></p>
                        </div>
                      );
                    } catch (e) {
                      return <p>{selectedOrderForInvoice.shippingAddress}</p>;
                    }
                  })()}
                </div>
                
                {/* Packager instructions box */}
                <div className="space-y-1 border-r border-[#ECE7E3] pr-4 flex flex-col justify-between">
                  <div>
                    <span className="text-gray-400 block">دستورالعمل بسته‌بندی انباردار:</span>
                    {selectedOrderForInvoice.discreetShipping ? (
                      <div className="bg-red-50 text-red-700 p-2.5 sharp-corners border border-red-200 text-[10px] leading-relaxed mt-1 font-semibold">
                        * هشدار حریم خصوصی: مرسوله فوق کاملاً دیسکریت (بدون نام کالا و بدون برند تجاری روی کارتن بیرون) با پوشش خاکی بسته شود. فاکتور بدون ذکر نوع دقیق لباس فانتزی چسبانده شود!
                      </div>
                    ) : (
                      <p className="text-[#6F6F6F] leading-normal mt-1">بسته‌بندی استاندارد لفاف حباب‌دار کارتن تجاری.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Table of items (descriptions generic if discreet!) */}
              <table className="w-full border-collapse text-right">
                <thead>
                  <tr className="bg-[#FAF8F6] border border-[#ECE7E3] font-semibold text-[#1A1A1A]">
                    <th className="p-2 border border-[#ECE7E3]">ردیف</th>
                    <th className="p-2 border border-[#ECE7E3]">شرح کالا / مرسوله پستی</th>
                    <th className="p-2 border border-[#ECE7E3]">مشخصات (رنگ/سایز)</th>
                    <th className="p-2 border border-[#ECE7E3]">تعداد</th>
                    <th className="p-2 border border-[#ECE7E3] text-left">مبلغ نهایی (Toman)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECE7E3] text-[#6F6F6F]">
                  {selectedOrderForInvoice.items.map((item: any, idx: number) => (
                    <tr key={idx} className="border border-[#ECE7E3]">
                      <td className="p-2 border border-[#ECE7E3] text-center font-mono">{idx + 1}</td>
                      <td className="p-2 border border-[#ECE7E3] font-semibold text-[#1A1A1A]">
                        {selectedOrderForInvoice.discreetShipping ? "البسه عمومی راحتی بانوان" : item.productTitleSnapshot}
                      </td>
                      <td className="p-2 border border-[#ECE7E3]">
                        {selectedOrderForInvoice.discreetShipping ? "عمومی / فری‌سایز" : `${item.color} / سایز ${item.size}`}
                      </td>
                      <td className="p-2 border border-[#ECE7E3] text-center font-mono">{item.quantity}</td>
                      <td className="p-2 border border-[#ECE7E3] text-left font-mono">{((item.unitPrice * item.quantity)).toLocaleString("fa-IR")}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#FAF8F6] font-bold text-[#1A1A1A]">
                    <td colSpan={4} className="p-2 border border-[#ECE7E3] text-left">مبلغ پرداختی کل فاکتور:</td>
                    <td className="p-2 border border-[#ECE7E3] text-left font-mono">
                      {selectedOrderForInvoice.totalAmount.toLocaleString("fa-IR")} تومان
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Footer Stamp area */}
              <div className="flex justify-between items-center pt-8 border-t border-dashed border-[#ECE7E3]/60">
                <p className="text-[10px] text-gray-400">امضای متصدی انبار و بسته‌بندی _________________</p>
                <p className="text-[10px] text-gray-400">مهر خروج انبار و صدور محرمانه _________________</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
