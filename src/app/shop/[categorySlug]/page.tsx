import React from "react";
import ShopPage from "../page";

interface CategorySlugProps {
  params: Promise<{
    categorySlug: string;
  }>;
}

export default async function CategoryShopPage({ params }: CategorySlugProps) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.categorySlug;

  // Render the ShopPage directly, pre-injecting the categorySlug as category param
  const mockSearchParams = Promise.resolve({
    category: categorySlug,
  });

  return <ShopPage searchParams={mockSearchParams} />;
}
