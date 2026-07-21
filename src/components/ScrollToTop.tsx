"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Toggle visibility
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Calculate progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  // Circle path mathematics
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 bg-white text-[#1A1A1A] p-3 shadow-xl hover:text-[#D9A8A0] transition-colors border border-[#ECE7E3] sharp-corners flex items-center justify-center cursor-pointer group"
      style={{ width: "48px", height: "48px" }}
      aria-label="رفتن به بالا"
    >
      {/* SVG progress ring */}
      <svg className="absolute top-0 left-0 w-full h-full -rotate-90">
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="#ECE7E3"
          strokeWidth="2"
          fill="transparent"
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="#D9A8A0"
          strokeWidth="2"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-100"
        />
      </svg>
      <ArrowUp size={18} className="relative z-10 group-hover:-translate-y-0.5 transition-transform duration-200" />
    </button>
  );
}
