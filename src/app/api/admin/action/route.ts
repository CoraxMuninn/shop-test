import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // 1. Authenticate and enforce RBAC Admin role security!
    const session = await auth();
    if (!session || !session.user || (session.user as any).role !== "Admin") {
      return NextResponse.json({ error: "شما مجاز به دسترسی به این بخش نیستید." }, { status: 403 });
    }

    const body = await request.json();
    const { action, payload } = body;

    if (!action) {
      return NextResponse.json({ error: "اکشن مورد نظر مشخص نشده است." }, { status: 400 });
    }

    // 2. Route administrative actions
    switch (action) {
      
      // PRODUCT mutators
      case "createProduct": {
        const { title, slug, description, categoryId, basePrice, published, featured, variants, faq } = payload;
        const newProduct = await prisma.product.create({
          data: {
            title,
            slug: slug.toLowerCase(),
            description,
            categoryId,
            basePrice: parseInt(basePrice),
            published: !!published,
            featured: !!featured,
            variants: typeof variants === "string" ? variants : JSON.stringify(variants),
            faq: typeof faq === "string" ? faq : JSON.stringify(faq),
          },
        });
        return NextResponse.json({ success: true, product: newProduct });
      }

      case "updateProduct": {
        const { id, title, slug, description, categoryId, basePrice, published, featured, variants, faq } = payload;
        const updatedProduct = await prisma.product.update({
          where: { id },
          data: {
            title,
            slug: slug.toLowerCase(),
            description,
            categoryId,
            basePrice: parseInt(basePrice),
            published: !!published,
            featured: !!featured,
            variants: typeof variants === "string" ? variants : JSON.stringify(variants),
            faq: typeof faq === "string" ? faq : JSON.stringify(faq),
          },
        });
        return NextResponse.json({ success: true, product: updatedProduct });
      }

      case "deleteProduct": {
        const { id } = payload;
        // Enforce cascading deletion or block if orders exist (by schema onDelete: Restrict applies)
        const orderCount = await prisma.orderItem.count({ where: { productId: id } });
        if (orderCount > 0) {
          return NextResponse.json({
            error: "حذف این محصول امکان‌پذیر نیست زیرا برای آن در سیستم سفارش ثبت شده است. به جای حذف آن را غیرفعال کنید.",
          }, { status: 400 });
        }
        await prisma.product.delete({ where: { id } });
        return NextResponse.json({ success: true });
      }

      // CATEGORY mutators
      case "manageCategory": {
        const { type, id, name, slug, parentId, sortOrder } = payload;

        if (type === "create") {
          const newCat = await prisma.category.create({
            data: {
              name,
              slug: slug.toLowerCase(),
              parentId: parentId || null,
              sortOrder: parseInt(sortOrder || "0"),
            },
          });
          return NextResponse.json({ success: true, category: newCat });
        }

        if (type === "update") {
          const updatedCat = await prisma.category.update({
            where: { id },
            data: {
              name,
              slug: slug.toLowerCase(),
              parentId: parentId || null,
              sortOrder: parseInt(sortOrder || "0"),
            },
          });
          return NextResponse.json({ success: true, category: updatedCat });
        }

        if (type === "delete") {
          // Block category deletion if products are assigned
          const productCount = await prisma.product.count({ where: { categoryId: id } });
          const articleCount = await prisma.article.count({ where: { categoryId: id } });
          const childCats = await prisma.category.count({ where: { parentId: id } });

          if (productCount > 0 || articleCount > 0 || childCats > 0) {
            return NextResponse.json({
              error: "حذف این دسته امکان‌پذیر نیست زیرا محصول، مقاله یا زیردسته به آن اختصاص یافته است. ابتدا موارد وابسته را جابجا کنید.",
            }, { status: 400 });
          }

          await prisma.category.delete({ where: { id } });
          return NextResponse.json({ success: true });
        }
        break;
      }

      // ORDER mutators
      case "updateOrderStatus": {
        const { id, status, trackingCode, paymentStatus } = payload;
        const updatedOrder = await prisma.order.update({
          where: { id },
          data: {
            status,
            paymentStatus,
            trackingCode: trackingCode || null,
          },
        });
        return NextResponse.json({ success: true, order: updatedOrder });
      }

      // ARTICLE mutators
      case "createArticle": {
        const { title, slug, excerpt, content, featuredImage, categoryId, metaTitle, metaDescription, canonicalUrl, indexStatus, publishStatus } = payload;
        const newArticle = await prisma.article.create({
          data: {
            title,
            slug: slug.toLowerCase(),
            excerpt,
            content,
            featuredImage,
            categoryId,
            metaTitle,
            metaDescription,
            canonicalUrl,
            indexStatus: !!indexStatus,
            publishStatus,
          },
        });
        return NextResponse.json({ success: true, article: newArticle });
      }

      case "updateArticle": {
        const { id, title, slug, excerpt, content, featuredImage, categoryId, metaTitle, metaDescription, canonicalUrl, indexStatus, publishStatus } = payload;
        const updatedArticle = await prisma.article.update({
          where: { id },
          data: {
            title,
            slug: slug.toLowerCase(),
            excerpt,
            content,
            featuredImage,
            categoryId,
            metaTitle,
            metaDescription,
            canonicalUrl,
            indexStatus: !!indexStatus,
            publishStatus,
          },
        });
        return NextResponse.json({ success: true, article: updatedArticle });
      }

      case "deleteArticle": {
        const { id } = payload;
        await prisma.article.delete({ where: { id } });
        return NextResponse.json({ success: true });
      }

      // REVIEW moderation mutators
      case "updateReviewStatus": {
        const { id, moderationStatus, reply } = payload;
        const updatedReview = await prisma.review.update({
          where: { id },
          data: {
            moderationStatus,
            reply: reply || null,
          },
        });
        return NextResponse.json({ success: true, review: updatedReview });
      }

      case "deleteReview": {
        const { id } = payload;
        await prisma.review.delete({ where: { id } });
        return NextResponse.json({ success: true });
      }

      // DISCOUNT CODE mutators
      case "createDiscount": {
        const { code, type, value, startsAt, expiresAt, usageLimit } = payload;
        const newDiscount = await prisma.discountCode.create({
          data: {
            code: code.toUpperCase(),
            type,
            value: parseInt(value),
            startsAt: new Date(startsAt),
            expiresAt: new Date(expiresAt),
            usageLimit: parseInt(usageLimit),
          },
        });
        return NextResponse.json({ success: true, discountCode: newDiscount });
      }

      case "deleteDiscount": {
        const { id } = payload;
        await prisma.discountCode.delete({ where: { id } });
        return NextResponse.json({ success: true });
      }

      // USER role mutator
      case "updateUserRole": {
        const { id, role } = payload;
        // Don't allow changing role if they are trying to demote their own admin account
        if (id === (session.user as any).id && role !== "Admin") {
          return NextResponse.json({ error: "شما نمی‌توانید دسترسی ادمین خود را لغو کنید." }, { status: 400 });
        }
        const updatedUser = await prisma.user.update({
          where: { id },
          data: { role },
        });
        return NextResponse.json({ success: true, user: updatedUser });
      }

      default:
        return NextResponse.json({ error: "اکشن ارسالی نامعتبر است." }, { status: 400 });
    }

    return NextResponse.json({ error: "اکشن انجام نشد." }, { status: 400 });
  } catch (error: any) {
    console.error("Admin Action API Error:", error);
    return NextResponse.json({ error: error.message || "خطایی در انجام عملیات پیش آمد." }, { status: 500 });
  }
}
