"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import {
  Star,
  Heart,
  ShoppingBag,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  RotateCcw,
  Share2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

interface ProductClientProps {
  product: any;
  reviews: any[];
  relatedProducts: any[];
}

function getProductMainImage(variantsStr: any): string {
  try {
    const vars = typeof variantsStr === "string" ? JSON.parse(variantsStr) : variantsStr;
    if (vars?.[0]?.images?.[0]) return vars[0].images[0];
  } catch (e) {}
  return "/images/bra-luxury.jpg";
}

export default function ProductClient({ product, reviews, relatedProducts }: ProductClientProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useApp();

  // Parse variants and FAQs safely
  let variants: any[] = [];
  try {
    variants = typeof product.variants === "string" ? JSON.parse(product.variants) : product.variants;
  } catch (e) {
    console.error("Failed to parse variants:", e);
  }

  let faqs: any[] = [];
  try {
    faqs = typeof product.faq === "string" ? JSON.parse(product.faq) : product.faq;
  } catch (e) {
    console.error("Failed to parse faqs:", e);
  }

  // Active states
  const [selectedColor, setSelectedColor] = useState(variants[0]?.color || "");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("description"); // description, spec, faq, reviews
  const [toastMessage, setToastMessage] = useState("");

  // Review submission state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Get active variant based on selected color
  const activeVariant = variants.find((v) => v.color === selectedColor) || variants[0];

  // Reset active image index and size when color changes
  useEffect(() => {
    setActiveImageIndex(0);
    setSelectedSize("");
    setQuantity(1);
  }, [selectedColor]);

  const activeImages = activeVariant?.images || ["/images/bra-luxury.jpg"];

  // Find active size details
  const sizeDetails = activeVariant?.sizes.find((s: any) => s.size === selectedSize);
  const maxStock = sizeDetails?.stock || 0;

  // Handle price and override
  const currentPrice = sizeDetails?.priceOverride || product.basePrice;

  // Share helper
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("لینک محصول با موفقیت کپی شد.");
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      showToast("لطفاً ابتدا سایز مورد نظر خود را انتخاب کنید.");
      return;
    }

    addToCart({
      productId: product.id,
      title: product.title,
      price: currentPrice,
      image: activeImages[0],
      color: activeVariant?.colorName || selectedColor,
      size: selectedSize,
      quantity,
    });

    showToast("محصول با موفقیت به سبد خرید افزوده شد.");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  // Specs helper based on category
  const getProductSpecs = () => {
    const defaultSpecs = [
      { name: "کشور تولید کننده پارچه", value: "فرانسه" },
      { name: "کشور مونتاژ و دوخت", value: "ایران (بخش اختصاصی Lebaszirzanane)" },
      { name: "متریال اصلی", value: "گیپور لوکس، ابریشم طبیعی ضد حساسیت" },
      { name: "میزان کشسانی", value: "بسیار عالی و نرم" },
      { name: "تنفس‌پذیری", value: "فوق‌العاده عالی و بهداشتی" },
    ];
    return defaultSpecs;
  };

  return (
    <div className="text-right flex flex-col space-y-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#1A1A1A] text-white text-xs px-6 py-3.5 sharp-corners shadow-xl flex items-center gap-2 fade-in border border-[#D9A8A0]">
          <AlertCircle size={16} className="text-[#D9A8A0]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main product box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Side: Image Gallery (Span 5) */}
        <div className="lg:col-span-5 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-3 justify-center md:justify-start">
            {activeImages.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-16 h-20 bg-gray-50 border sharp-corners overflow-hidden transition-all ${
                  activeImageIndex === idx ? "border-[#D9A8A0] ring-1 ring-[#D9A8A0]" : "border-[#ECE7E3]"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Main Large Image */}
          <div className="flex-1 bg-[#FAF8F6] border border-[#ECE7E3]/30 h-[500px] overflow-hidden sharp-corners relative group">
            <img
              src={activeImages[activeImageIndex]}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Right Side: Product Details & Purchase Forms (Span 7) */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          <div>
            <span className="text-xs text-[#D9A8A0] tracking-wider uppercase font-semibold">
              {product.category.name}
            </span>
            <h1 className="text-2xl sm:text-3xl font-light text-[#1A1A1A] mt-2 font-serif leading-tight">
              {product.title}
            </h1>
          </div>

          {/* Ratings & Socials */}
          <div className="flex items-center justify-start gap-4 border-b border-[#ECE7E3] pb-4 text-xs font-light text-[#6F6F6F]">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 flex items-center">
                <Star size={14} fill="currentColor" />
              </span>
              <span className="font-semibold text-[#1A1A1A]">۴.۹</span>
              <span>({reviews.length} دیدگاه خریداران)</span>
            </div>
            <span>|</span>
            <button
              onClick={handleShare}
              className="hover:text-[#D9A8A0] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Share2 size={14} />
              اشتراک‌گذاری
            </button>
          </div>

          {/* Price */}
          <div className="text-2xl font-light text-[#1A1A1A]">
            {currentPrice.toLocaleString("fa-IR")} تومان
          </div>

          {/* Short description excerpt */}
          <p className="text-xs text-[#6F6F6F] leading-relaxed font-light">
            {product.description.slice(0, 250)}...
          </p>

          {/* COLOR SELECTOR */}
          {variants.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-[#1A1A1A] mb-3">
                رنگ: <span className="font-light text-[#6F6F6F]">{activeVariant?.colorName}</span>
              </h3>
              <div className="flex gap-3">
                {variants.map((v) => (
                  <button
                    key={v.color}
                    onClick={() => setSelectedColor(v.color)}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center p-0.5 transition-all ${
                      selectedColor === v.color
                        ? "border-[#1A1A1A] scale-105"
                        : "border-[#ECE7E3] hover:border-gray-400"
                    }`}
                  >
                    <span
                      className="w-full h-full rounded-full"
                      style={{
                        backgroundColor:
                          v.color === "rose"
                            ? "#D9A8A0"
                            : v.color === "cream"
                            ? "#FAF8F6"
                            : v.color === "black"
                            ? "#1A1A1A"
                            : v.color === "pastel"
                            ? "#E8E5E0"
                            : v.color === "sage-green"
                            ? "#9CAF9C"
                            : "#ECE7E3",
                      }}
                    ></span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SIZE SELECTOR WITH STOCK MATRIX */}
          {activeVariant?.sizes && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-semibold text-[#1A1A1A]">سایزبندی دقیق</h3>
                <Link
                  href="/privacy"
                  className="text-[10px] text-[#D9A8A0] underline font-light hover:text-[#c3948b]"
                >
                  راهنمای سایز و تن‌خور (سایز ایده آل شما)
                </Link>
              </div>

              <div className="flex flex-wrap gap-2">
                {activeVariant.sizes.map((s: any) => {
                  const isOutOfStock = s.stock === 0;
                  const isLowStock = s.stock > 0 && s.stock < 4;

                  return (
                    <button
                      key={s.size}
                      disabled={isOutOfStock}
                      onClick={() => setSelectedSize(s.size)}
                      className={`px-4 py-2 border text-xs transition-all flex flex-col items-center justify-center sharp-corners cursor-pointer ${
                        selectedSize === s.size
                          ? "border-[#D9A8A0] bg-[#FAF8F6] text-[#D9A8A0] font-bold"
                          : isOutOfStock
                          ? "border-dashed border-[#ECE7E3] text-gray-300 cursor-not-allowed bg-gray-50/50"
                          : "border-[#ECE7E3] text-[#1A1A1A] hover:border-gray-400"
                      }`}
                    >
                      <span className="font-semibold">{s.size}</span>
                      {isOutOfStock ? (
                        <span className="text-[8px] text-red-400">ناموجود</span>
                      ) : isLowStock ? (
                        <span className="text-[8px] text-yellow-600">فقط {s.stock} عدد</span>
                      ) : (
                        <span className="text-[8px] text-gray-400">موجود</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* QUANTITY SELECTOR AND BUTTON ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-[#ECE7E3]">
            {/* Quantity select */}
            {selectedSize && maxStock > 0 && (
              <div className="flex items-center border border-[#ECE7E3] w-fit sharp-corners">
                <button
                  disabled={quantity >= maxStock}
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 text-[#1A1A1A] hover:text-[#D9A8A0] disabled:text-gray-300 cursor-pointer"
                >
                  <Plus size={14} />
                </button>
                <span className="px-4 text-sm font-semibold">{quantity}</span>
                <button
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => q - 1)}
                  className="px-3 py-2 text-[#1A1A1A] hover:text-[#D9A8A0] disabled:text-gray-300 cursor-pointer"
                >
                  <Minus size={14} />
                </button>
              </div>
            )}

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-[#1A1A1A] text-white py-3 px-8 text-xs font-semibold hover:bg-[#D9A8A0] transition-colors sharp-corners flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag size={16} />
              افزودن به سبد خرید
            </button>

            {/* Wishlist toggle */}
            <button
              onClick={() => {
                toggleWishlist(product.id);
                showToast(
                  isInWishlist(product.id)
                    ? "از لیست علاقه‌مندی‌ها حذف شد."
                    : "به لیست علاقه‌مندی‌ها افزوده شد."
                );
              }}
              className={`p-3 border sharp-corners cursor-pointer transition-colors flex items-center justify-center ${
                isInWishlist(product.id)
                  ? "border-[#D9A8A0] text-[#D9A8A0] bg-[#FAF8F6]"
                  : "border-[#ECE7E3] text-[#1A1A1A] hover:border-gray-400"
              }`}
            >
              <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Quick policy check box */}
          <div className="grid grid-cols-3 gap-4 pt-4 text-center border-t border-[#ECE7E3] text-[10px] text-[#6F6F6F] font-light">
            <div className="flex flex-col items-center">
              <RotateCcw size={16} className="text-[#D9A8A0] mb-1" />
              <span>ضمانت ۷ روزه بهداشتی</span>
            </div>
            <div className="flex flex-col items-center border-x border-[#ECE7E3]">
              <Truck size={16} className="text-[#D9A8A0] mb-1" />
              <span>بسته‌بندی کاملا محرمانه</span>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck size={16} className="text-[#D9A8A0] mb-1" />
              <span>تضمین اصالت پارچه لوکس</span>
            </div>
          </div>
        </div>
      </div>

      {/* TABS SECTION: Description, Specifications, FAQ, Reviews */}
      <div className="border border-[#ECE7E3] sharp-corners overflow-hidden">
        {/* Tab Headers */}
        <div className="bg-[#FAF8F6] border-b border-[#ECE7E3] flex justify-start">
          {[
            { id: "description", label: "توضیحات تکمیلی" },
            { id: "specifications", label: "مشخصات فنی" },
            { id: "faq", label: `سؤالات متداول (${faqs.length})` },
            { id: "reviews", label: `دیدگاه کاربران (${reviews.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 sm:px-8 py-4 text-xs font-semibold transition-all cursor-pointer border-b-2 ${
                activeTab === tab.id
                  ? "border-[#D9A8A0] text-[#D9A8A0] bg-white"
                  : "border-transparent text-[#6F6F6F] hover:text-[#1A1A1A]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Panels */}
        <div className="p-6 sm:p-8 bg-white text-sm font-light leading-relaxed text-right">
          {/* DESCRIPTION */}
          {activeTab === "description" && (
            <div className="space-y-4 text-xs sm:text-sm">
              <p>{product.description}</p>
              <p className="text-[#6F6F6F] border-r-2 border-[#D9A8A0] pr-3 mt-4">
                توضیحات طراحی: تمامی برش‌ها و درزهای این محصول با چرخ‌های خیاطی فوق‌پیشرفته التراسونیک دوخته شده‌اند تا از عدم ایجاد خط و حساسیت روی پوست کاملاً اطمینان حاصل شود. الیاف پنبه با گواهی جهانی بهداشتی در بخش فاق کار تعبیه شده است.
              </p>
            </div>
          )}

          {/* SPECIFICATIONS */}
          {activeTab === "specifications" && (
            <div className="max-w-xl space-y-3">
              {getProductSpecs().map((spec, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b border-gray-50 text-xs sm:text-sm">
                  <span className="text-[#1A1A1A] font-semibold">{spec.name}</span>
                  <span className="text-[#6F6F6F]">{spec.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* FAQ */}
          {activeTab === "faq" && (
            <div className="space-y-4">
              {faqs.length > 0 ? (
                faqs.map((faq, idx) => (
                  <div key={idx} className="p-4 bg-[#FAF8F6] border border-[#ECE7E3] sharp-corners">
                    <h4 className="font-bold text-xs sm:text-sm text-[#1A1A1A] flex items-center gap-2 mb-2">
                      <HelpCircle size={16} className="text-[#D9A8A0]" />
                      {faq.question}
                    </h4>
                    <p className="text-xs text-[#6F6F6F] pr-6">{faq.answer}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400">سؤالی برای این محصول ثبت نشده است.</p>
              )}
            </div>
          )}

          {/* REVIEWS */}
          {activeTab === "reviews" && (
            <div className="space-y-8">
              {/* Existing reviews */}
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <div key={rev.id} className="p-4 border border-[#ECE7E3] sharp-corners">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-[#1A1A1A]">
                          {rev.user.name || "خریدار ناشناس"}
                        </span>
                        <div className="flex items-center gap-0.5 text-xs text-yellow-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} size={12} fill="currentColor" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-[#6F6F6F]">{rev.comment}</p>
                      {rev.reply && (
                        <div className="mt-3 p-3 bg-[#FAF8F6] border-r-2 border-[#D9A8A0] text-[11px] text-[#1A1A1A]">
                          <strong>پاسخ مدیریت لباس زیر زنانه:</strong> {rev.reply}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">نظری برای این محصول ثبت نشده است. اولین نفری باشید که دیدگاه خود را ثبت می‌کنید.</p>
                )}
              </div>

              {/* Add Review Form */}
              <div className="pt-6 border-t border-[#ECE7E3]">
                <h3 className="font-bold text-sm text-[#1A1A1A] mb-4">دیدگاه خود را ثبت کنید</h3>
                
                {reviewSubmitted ? (
                  <div className="bg-[#FAF8F6] text-green-700 text-xs p-4 sharp-corners border border-green-200">
                    دیدگاه شما با موفقیت ثبت شد و پس از تایید مدیریت در سایت نمایش داده خواهد شد. از همراهی شما سپاسگزاریم!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Stars Selection */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#6F6F6F]">امتیاز شما:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            onClick={() => setRating(s)}
                            className="text-yellow-500 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star size={16} fill={rating >= s ? "currentColor" : "none"} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Textarea */}
                    <div>
                      <textarea
                        rows={4}
                        placeholder="تجربه خرید یا سوالات خود را درباره تن‌خور و متریال کار بنویسید..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full border border-[#ECE7E3] p-3 text-xs focus:ring-1 focus:ring-[#D9A8A0] outline-none"
                      ></textarea>
                    </div>

                    <div>
                      <button
                        onClick={() => {
                          if (!comment.trim()) {
                            showToast("لطفاً متن دیدگاه را وارد کنید.");
                            return;
                          }
                          setReviewSubmitted(true);
                          setComment("");
                        }}
                        className="bg-[#1A1A1A] text-white text-xs px-6 py-3 hover:bg-[#D9A8A0] transition-colors sharp-corners cursor-pointer"
                      >
                        ثبت و ارسال دیدگاه
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section>
          <div className="flex flex-col items-end mb-8 border-b border-[#ECE7E3] pb-4">
            <span className="text-xs text-[#D9A8A0] tracking-widest font-semibold uppercase block">YOU MAY ALSO LIKE</span>
            <h2 className="text-xl font-light text-[#1A1A1A] font-serif">محصولات مشابه و پیشنهادی</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => {
              const img = getProductMainImage(p.variants);
              return (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  className="group flex flex-col space-y-3 cursor-pointer"
                >
                  <div className="relative bg-[#FAF8F6] h-80 overflow-hidden sharp-corners border border-[#ECE7E3]/30">
                    <img
                      src={img}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="text-right flex flex-col space-y-1">
                    <h3 className="font-light text-sm text-[#1A1A1A] truncate hover:text-[#D9A8A0] transition-colors">
                      {p.title}
                    </h3>
                    <div className="flex items-center justify-end gap-1.5 text-xs text-[#6F6F6F]">
                      <span className="font-semibold text-[#1A1A1A]">
                        {p.basePrice.toLocaleString("fa-IR")} تومان
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
