import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "@/components/ClientProviders";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import SearchModal from "@/components/SearchModal";

export const metadata: Metadata = {
  title: "لباس زیر زنانه - Lebaszirzanane | فروشگاه تخصصی لباس زیر زنانه لوکس و مدرن",
  description: "برترین برندهای لباس زیر زنانه لوکس، سوتین گیپور، ست فانتزی، شورت نخی و لباس خواب ساتن در ایران با تضمین کیفیت، ۷ روز ضمانت بازگشت و ارسال کاملاً محرمانه.",
  keywords: "لباس زیر زنانه, سوتین گیپور, ست شورت و سوتین, لباس خواب ساتن, بادی فانتزی, لباس زیر لوکس, خرید لباس زیر",
  alternates: {
    canonical: "https://lebaszirzanane.ir",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col antialiased">
        <ClientProviders>
          {/* Header */}
          <Header />

          {/* Main Content Area */}
          <main className="flex-grow pt-24">
            {children}
          </main>

          {/* Footer */}
          <Footer />

          {/* Floating Actions & Overlays */}
          <ScrollToTop />
          <SearchModal />
        </ClientProviders>
      </body>
    </html>
  );
}
