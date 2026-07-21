"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { Search, X, ShoppingBag, BookOpen, Clock, Flame, ArrowLeft } from "lucide-react";
import Link from "next/navigation";
import { useRouter } from "next/navigation";

export default function SearchModal() {
  const { searchModalOpen, setSearchModalOpen } = useApp();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    products: any[];
    articles: any[];
  }>({ products: [], articles: [] });
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const popularSearches = ["سوتین گیپور", "شورت نخی", "ست لباس خواب", "بادی فانتزی", "لباس ورزشی"];

  // Focus input on open
  useEffect(() => {
    if (searchModalOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      // Load recent searches from localStorage
      const stored = localStorage.getItem("lebaszir_recent_searches");
      if (stored) {
        try {
          setRecentSearches(JSON.parse(stored));
        } catch (e) {}
      }
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [searchModalOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && searchModalOpen) {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchModalOpen, setSearchModalOpen]);

  // Search API Call with debounce
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults({ products: [], articles: [] });
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error("Search fetch failed:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSearchSubmit = (searchVal: string) => {
    if (!searchVal.trim()) return;

    // Save to recent searches
    const updated = [searchVal, ...recentSearches.filter((s) => s !== searchVal)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("lebaszir_recent_searches", JSON.stringify(updated));

    setSearchModalOpen(false);
    // Redirect to a shop page with search query
    router.push(`/shop?search=${encodeURIComponent(searchVal)}`);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("lebaszir_recent_searches");
  };

  if (!searchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1A1A]/80 backdrop-blur-md flex flex-col justify-start items-center p-4 md:p-12 overflow-y-auto">
      {/* Container */}
      <div className="w-full max-w-4xl bg-white sharp-corners p-6 md:p-8 flex flex-col shadow-2xl relative fade-in mt-4 md:mt-12">
        {/* Close Button */}
        <button
          onClick={() => setSearchModalOpen(false)}
          className="absolute top-6 left-6 text-gray-400 hover:text-black transition-colors"
          aria-label="بستن"
        >
          <X size={24} />
        </button>

        {/* Logo or Brand */}
        <div className="mb-6 text-center">
          <span className="font-bold text-2xl tracking-widest text-[#1A1A1A] font-serif uppercase">
            LEBASZIRZANANE
          </span>
          <p className="text-xs text-[#6F6F6F] mt-1">جستجوی هوشمند و سریع در محصولات و مقالات</p>
        </div>

        {/* Input Bar */}
        <div className="relative border-b-2 border-[#ECE7E3] pb-2 mb-8 flex items-center">
          <Search className="text-[#6F6F6F] mr-2" size={24} />
          <input
            ref={inputRef}
            type="text"
            placeholder="نام سوتین، ست لباس زیر، یا عنوان مقاله مورد نظر را جستجو کنید..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchSubmit(query);
              }
            }}
            className="w-full text-lg md:text-xl px-4 py-2 border-none outline-none text-[#1A1A1A] font-light placeholder-gray-400 focus:ring-0 bg-transparent text-right"
            dir="rtl"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-gray-400 hover:text-black transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Grid Results / Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right" dir="rtl">
          {/* Main Results (Products & Articles) */}
          <div className="md:col-span-2 space-y-6">
            {loading && (
              <div className="py-12 text-center text-gray-500">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-[#D9A8A0] border-t-transparent rounded-full mb-2"></div>
                <p className="text-sm">در حال جستجوی هوشمند...</p>
              </div>
            )}

            {!loading && query.trim().length >= 2 && (
              <>
                {/* Product Results */}
                {results.products.length > 0 && (
                  <div>
                    <h3 className="font-bold text-sm text-[#1A1A1A] border-b border-[#ECE7E3] pb-2 mb-4 flex items-center gap-2">
                      <ShoppingBag size={16} className="text-[#D9A8A0]" />
                      محصولات پیدا شده ({results.products.length})
                    </h3>
                    <div className="space-y-4">
                      {results.products.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            setSearchModalOpen(false);
                            router.push(`/product/${p.slug}`);
                          }}
                          className="flex items-center gap-4 p-2 hover:bg-[#FAF8F6] cursor-pointer group transition-colors border border-transparent hover:border-[#ECE7E3]"
                        >
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-16 h-20 object-cover bg-gray-100 sharp-corners"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-[#1A1A1A] truncate group-hover:text-[#D9A8A0] transition-colors">
                              {p.title}
                            </h4>
                            <p className="text-xs text-[#6F6F6F] mt-1">{p.categoryName}</p>
                            <p className="text-xs font-semibold text-[#1A1A1A] mt-1">
                              {p.basePrice.toLocaleString("fa-IR")} تومان
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Article Results */}
                {results.articles.length > 0 && (
                  <div>
                    <h3 className="font-bold text-sm text-[#1A1A1A] border-b border-[#ECE7E3] pb-2 mb-4 flex items-center gap-2 mt-6">
                      <BookOpen size={16} className="text-[#D9A8A0]" />
                      مقالات مجله ({results.articles.length})
                    </h3>
                    <div className="space-y-4">
                      {results.articles.map((a) => (
                        <div
                          key={a.id}
                          onClick={() => {
                            setSearchModalOpen(false);
                            router.push(`/blog/${a.slug}`);
                          }}
                          className="flex items-start gap-4 p-2 hover:bg-[#FAF8F6] cursor-pointer group transition-colors border border-transparent hover:border-[#ECE7E3]"
                        >
                          <img
                            src={a.image}
                            alt={a.title}
                            className="w-16 h-16 object-cover bg-gray-100 sharp-corners"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-[#1A1A1A] truncate group-hover:text-[#D9A8A0] transition-colors">
                              {a.title}
                            </h4>
                            <p className="text-xs text-[#6F6F6F] line-clamp-2 mt-1">{a.excerpt}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {results.products.length === 0 && results.articles.length === 0 && (
                  <div className="py-12 text-center text-gray-500">
                    <p className="text-lg font-medium">هیچ نتیجه‌ای یافت نشد</p>
                    <p className="text-sm text-gray-400 mt-2">
                      کلمات کلیدی دیگری را امتحان کنید یا از دسته‌بندی‌ها استفاده کنید.
                    </p>
                  </div>
                )}
              </>
            )}

            {!loading && query.trim().length < 2 && (
              <div className="py-12 text-center text-gray-400">
                <Search size={48} className="mx-auto text-gray-200 mb-3" />
                <p className="text-sm">حداقل ۲ حرف برای شروع جستجوی هوشمند تایپ کنید.</p>
              </div>
            )}
          </div>

          {/* Sidebar (Recent & Popular) */}
          <div className="space-y-8 border-r border-[#ECE7E3] pr-6 hidden md:block">
            {/* Recent Searches */}
            <div>
              <div className="flex items-center justify-between border-b border-[#ECE7E3] pb-2 mb-4">
                <h3 className="font-bold text-sm text-[#1A1A1A] flex items-center gap-2">
                  <Clock size={16} className="text-[#6F6F6F]" />
                  جستجوهای اخیر
                </h3>
                {recentSearches.length > 0 && (
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                  >
                    پاک کردن
                  </button>
                )}
              </div>

              {recentSearches.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(s);
                        handleSearchSubmit(s);
                      }}
                      className="text-xs bg-[#FAF8F6] text-[#1A1A1A] px-3 py-1.5 border border-[#ECE7E3] hover:border-[#D9A8A0] transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">تاریخچه جستجویی یافت نشد.</p>
              )}
            </div>

            {/* Popular Searches */}
            <div>
              <h3 className="font-bold text-sm text-[#1A1A1A] border-b border-[#ECE7E3] pb-2 mb-4 flex items-center gap-2">
                <Flame size={16} className="text-[#D9A8A0]" />
                بیشترین جستجوها
              </h3>
              <div className="flex flex-col gap-2">
                {popularSearches.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(s);
                      handleSearchSubmit(s);
                    }}
                    className="text-right text-xs text-[#6F6F6F] hover:text-[#D9A8A0] py-1.5 transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft size={12} className="rotate-180 text-gray-300" />
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
