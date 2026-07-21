import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function normalizePersianText(text: string): string {
  if (!text) return "";
  return text
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200C/g, " ") // half-space
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get("q") || "";
    const query = normalizePersianText(rawQuery);

    if (!query) {
      return NextResponse.json({ products: [], articles: [] });
    }

    // Fetch all published products and articles with their categories
    const [products, articles] = await Promise.all([
      prisma.product.findMany({
        where: { published: true },
        include: { category: true },
      }),
      prisma.article.findMany({
        where: { publishStatus: "Published" },
        include: { category: true },
      }),
    ]);

    // Filter products
    const filteredProducts = products
      .filter((p) => {
        const normTitle = normalizePersianText(p.title);
        const normDesc = normalizePersianText(p.description);
        const normCat = normalizePersianText(p.category.name);

        return (
          normTitle.includes(query) ||
          normDesc.includes(query) ||
          normCat.includes(query)
        );
      })
      .map((p) => {
        // Parse variants to find first image
        let firstImage = "/images/bra-luxury.jpg";
        try {
          const vars = JSON.parse(p.variants);
          if (vars?.[0]?.images?.[0]) {
            firstImage = vars[0].images[0];
          }
        } catch (e) {}

        return {
          id: p.id,
          title: p.title,
          slug: p.slug,
          basePrice: p.basePrice,
          categoryName: p.category.name,
          image: firstImage,
        };
      })
      .slice(0, 5); // Limit suggestions

    // Filter articles
    const filteredArticles = articles
      .filter((a) => {
        const normTitle = normalizePersianText(a.title);
        const normExcerpt = normalizePersianText(a.excerpt);
        const normContent = normalizePersianText(a.content);
        const normCat = normalizePersianText(a.category.name);

        return (
          normTitle.includes(query) ||
          normExcerpt.includes(query) ||
          normContent.includes(query) ||
          normCat.includes(query)
        );
      })
      .map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        categoryName: a.category.name,
        image: a.featuredImage,
      }))
      .slice(0, 5); // Limit suggestions

    return NextResponse.json({
      products: filteredProducts,
      articles: filteredArticles,
    });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
