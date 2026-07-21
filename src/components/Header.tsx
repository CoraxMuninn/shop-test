"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Search, ShoppingBag, Heart, User, ChevronDown, Menu, X, ArrowLeft } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  children?: CategoryNode[];
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopMegaOpen, setShopMegaOpen] = useState(false);
  const [articlesMegaOpen, setArticlesMegaOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { cart, wishlist, setSearchModalOpen } = useApp();

  // Is homepage and transparent header is needed
  const isHome = pathname === "/";

  // Handle header background on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch categories live from database
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (e) {
        console.error("Failed to load header categories:", e);
      }
    };
    fetchCats();
  }, []);

  // Total cart items
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Sign out helper
  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <>
      {/* Promotion Bar at the very top */}
      <div className="w-full bg-[#1A1A1A] text-white py-1.5 text-center text-xs tracking-wider border-b border-[#ECE7E3]/10 z-50 relative">
        <span>ارسال رایگان برای خریدهای بالای ۸۰۰ هزار تومان + ۷ روز ضمانت بازگشت بی‌قید و شرط</span>
      </div>

      <header
        className={`fixed top-9 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled || !isHome
            ? "bg-white text-[#1A1A1A] shadow-sm border-b border-[#ECE7E3]"
            : "bg-transparent text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* LEFT SIDE: Icons/Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Search Button */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-2 hover:text-[#D9A8A0] transition-colors cursor-pointer"
              aria-label="جستجو"
            >
              <Search size={20} />
            </button>

            {/* Profile / Login */}
            {session ? (
              <div className="relative group">
                <Link
                  href={(session?.user as any)?.role === "Admin" ? "/admin" : "/account"}
                  className="p-2 hover:text-[#D9A8A0] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <User size={20} />
                  <span className="hidden md:inline text-xs font-light">
                    {(session?.user as any)?.role === "Admin" ? "پنل مدیریت" : "حساب کاربری"}
                  </span>
                </Link>
                <div className="absolute left-0 mt-1 w-40 bg-white shadow-lg border border-[#ECE7E3] py-2 sharp-corners hidden group-hover:block text-[#1A1A1A]">
                  <Link
                    href={(session?.user as any)?.role === "Admin" ? "/admin" : "/account"}
                    className="block px-4 py-2 text-xs text-right hover:bg-[#FAF8F6] hover:text-[#D9A8A0] transition-colors"
                  >
                    داشبورد من
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-right block px-4 py-2 text-xs text-red-600 hover:bg-[#FAF8F6] transition-colors cursor-pointer"
                  >
                    خروج از حساب
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="p-2 hover:text-[#D9A8A0] transition-colors flex items-center gap-1 cursor-pointer"
                aria-label="ورود"
              >
                <User size={20} />
                <span className="hidden md:inline text-xs font-light">ورود / ثبت‌نام</span>
              </Link>
            )}

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="p-2 hover:text-[#D9A8A0] transition-colors relative cursor-pointer"
              aria-label="علاقه‌مندی‌ها"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#D9A8A0] text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="p-2 hover:text-[#D9A8A0] transition-colors relative cursor-pointer"
              aria-label="سبد خرید"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#1A1A1A] text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 md:hidden hover:text-[#D9A8A0] transition-colors cursor-pointer"
              aria-label="منو"
            >
              <Menu size={22} />
            </button>
          </div>

          {/* CENTER: Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-light">
            <Link href="/" className={`hover:text-[#D9A8A0] transition-colors ${pathname === "/" ? "font-medium text-[#D9A8A0]" : ""}`}>
              خانه
            </Link>

            {/* Shop Mega Menu Trigger */}
            <div
              className="relative py-4"
              onMouseEnter={() => setShopMegaOpen(true)}
              onMouseLeave={() => setShopMegaOpen(false)}
            >
              <Link
                href="/shop"
                className={`hover:text-[#D9A8A0] transition-colors flex items-center gap-1 ${
                  pathname.startsWith("/shop") ? "font-medium text-[#D9A8A0]" : ""
                }`}
              >
                فروشگاه
                <ChevronDown size={14} />
              </Link>

              {/* Shop Mega Menu Content */}
              {shopMegaOpen && categories.length > 0 && (
                <div className="absolute right-1/2 translate-x-1/2 top-[100%] w-[80vw] max-w-4xl bg-white text-[#1A1A1A] shadow-xl border border-[#ECE7E3] p-8 grid grid-cols-4 gap-6 sharp-corners fade-in">
                  {categories.map((parent) => (
                    <div key={parent.id} className="text-right">
                      <Link
                        href={`/shop/${parent.slug}`}
                        className="font-semibold text-sm text-[#1A1A1A] hover:text-[#D9A8A0] transition-colors block pb-2 border-b border-[#ECE7E3] mb-3"
                      >
                        {parent.name}
                      </Link>
                      {parent.children && parent.children.length > 0 && (
                        <div className="space-y-1.5 flex flex-col">
                          {parent.children.map((child) => (
                            <Link
                              key={child.id}
                              href={`/shop/${child.slug}`}
                              className="text-xs text-[#6F6F6F] hover:text-[#D9A8A0] transition-colors"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Articles Menu Trigger (mirrors same categories) */}
            <div
              className="relative py-4"
              onMouseEnter={() => setArticlesMegaOpen(true)}
              onMouseLeave={() => setArticlesMegaOpen(false)}
            >
              <Link
                href="/blog"
                className={`hover:text-[#D9A8A0] transition-colors flex items-center gap-1 ${
                  pathname.startsWith("/blog") ? "font-medium text-[#D9A8A0]" : ""
                }`}
              >
                مجله مد
                <ChevronDown size={14} />
              </Link>

              {/* Articles Mega Menu Content */}
              {articlesMegaOpen && categories.length > 0 && (
                <div className="absolute right-1/2 translate-x-1/2 top-[100%] w-[70vw] max-w-3xl bg-white text-[#1A1A1A] shadow-xl border border-[#ECE7E3] p-8 grid grid-cols-4 gap-6 sharp-corners fade-in">
                  {categories.map((parent) => (
                    <div key={parent.id} className="text-right">
                      <Link
                        href={`/blog/category/${parent.slug}`}
                        className="font-semibold text-xs text-[#1A1A1A] hover:text-[#D9A8A0] transition-colors block pb-1 border-b border-[#ECE7E3] mb-2"
                      >
                        مقالات {parent.name}
                      </Link>
                      {parent.children && parent.children.length > 0 && (
                        <div className="space-y-1 flex flex-col">
                          {parent.children.map((child) => (
                            <Link
                              key={child.id}
                              href={`/blog/category/${child.slug}`}
                              className="text-[11px] text-[#6F6F6F] hover:text-[#D9A8A0] transition-colors"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link href="/about" className={`hover:text-[#D9A8A0] transition-colors ${pathname === "/about" ? "font-medium text-[#D9A8A0]" : ""}`}>
              درباره ما
            </Link>
            <Link href="/contact" className={`hover:text-[#D9A8A0] transition-colors ${pathname === "/contact" ? "font-medium text-[#D9A8A0]" : ""}`}>
              تماس با ما
            </Link>
          </nav>

          {/* RIGHT SIDE: Logo */}
          <div>
            <Link href="/" className="flex flex-col items-end cursor-pointer">
              <span className="font-bold text-xl sm:text-2xl tracking-widest uppercase font-serif">
                LEBASZIRZANANE
              </span>
              <span className="text-[9px] tracking-[4px] text-[#D9A8A0] font-light -mt-1 block">
                LUXURY LINGERIE
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#1A1A1A]/50 backdrop-blur-sm flex justify-end">
          <div className="w-80 max-w-[85vw] bg-white text-[#1A1A1A] h-full p-6 flex flex-col justify-between shadow-2xl relative animate-slide-in text-right" dir="rtl">
            
            {/* Close Mobile Button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 left-6 text-gray-400 hover:text-black transition-colors"
            >
              <X size={24} />
            </button>

            {/* Logo */}
            <div className="mt-8 mb-8 border-b border-[#ECE7E3] pb-6">
              <span className="font-bold text-lg tracking-widest uppercase font-serif block">
                LEBASZIRZANANE
              </span>
              <span className="text-[8px] tracking-[3px] text-[#D9A8A0] font-light block mt-1">
                LUXURY LINGERIE
              </span>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto space-y-4 text-sm font-light">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 hover:text-[#D9A8A0] border-b border-gray-50"
              >
                خانه
              </Link>

              {/* Shop section */}
              <div>
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 font-medium hover:text-[#D9A8A0]"
                >
                  فروشگاه (همه محصولات)
                </Link>
                <div className="pr-4 border-r-2 border-[#ECE7E3] mt-2 space-y-2">
                  {categories.slice(0, 4).map((parent) => (
                    <Link
                      key={parent.id}
                      href={`/shop/${parent.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs text-[#6F6F6F] hover:text-[#D9A8A0]"
                    >
                      {parent.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Blog section */}
              <div>
                <Link
                  href="/blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 font-medium hover:text-[#D9A8A0]"
                >
                  مجله مد و مقالات
                </Link>
              </div>

              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 hover:text-[#D9A8A0] border-b border-gray-50"
              >
                درباره ما
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 hover:text-[#D9A8A0] border-b border-gray-50"
              >
                تماس با ما
              </Link>
            </div>

            {/* Small support info */}
            <div className="border-t border-[#ECE7E3] pt-6 mt-6 text-xs text-[#6F6F6F] space-y-2">
              <p>تلفن پشتیبانی: ۰۲۱-۸۸۸۸۸۸۸۸</p>
              <p>ساعات کاری: ۱۰ الی ۱۸</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
