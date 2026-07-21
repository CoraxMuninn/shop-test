import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // 1. Clear existing data in correct dependency order
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.article.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.discountCode.deleteMany();
  await prisma.user.deleteMany();

  console.log("Cleared old database records.");

  // 2. Create Users
  // Admin user
  const adminUser = await prisma.user.create({
    data: {
      phone: "09121111111",
      role: "Admin",
      name: "مدیریت لباس زیر زنانه",
      addresses: JSON.stringify([
        {
          id: "addr_1",
          title: "دفتر مرکزی",
          receiver: "پشتیبانی لبلس زیر زنانه",
          phone: "09121111111",
          province: "تهران",
          city: "تهران",
          address: "خیابان ولیعصر، بالاتر از میدان ونک، برج نگار، طبقه ۱۰",
          postalCode: "1435678901",
        },
      ]),
    },
  });

  // Regular Customer
  const customerUser = await prisma.user.create({
    data: {
      phone: "09123456789",
      role: "Customer",
      name: "سارا احمدی",
      addresses: JSON.stringify([
        {
          id: "addr_2",
          title: "خانه",
          receiver: "سارا احمدی",
          phone: "09123456789",
          province: "تهران",
          city: "تهران",
          address: "خیابان شریعتی، کوچه یاس، پلاک ۴، واحد ۲",
          postalCode: "1939512345",
        },
      ]),
    },
  });

  console.log("Created Users: Admin and Customer.");

  // 3. Create Categories and Subcategories
  const categoriesData = [
    {
      name: "سوتین",
      slug: "bras",
      sortOrder: 1,
      subcategories: [
        { name: "فنردار", slug: "underwired-bras", sortOrder: 1 },
        { name: "بدون فنر", slug: "wireless-bras", sortOrder: 2 },
        { name: "فانتزی", slug: "fancy-bras", sortOrder: 3 },
        { name: "گیپور", slug: "lace-bras", sortOrder: 4 },
        { name: "پددار", slug: "padded-bras", sortOrder: 5 },
      ],
    },
    {
      name: "شورت",
      slug: "panties",
      sortOrder: 2,
      subcategories: [
        { name: "نخی", slug: "cotton-panties", sortOrder: 1 },
        { name: "فانتزی", slug: "fancy-panties", sortOrder: 2 },
        { name: "لامبادا", slug: "thong-panties", sortOrder: 3 },
        { name: "بدون پشت", slug: "backless-panties", sortOrder: 4 },
        { name: "توری", slug: "lace-panties", sortOrder: 5 },
      ],
    },
    {
      name: "ست لباس زیر",
      slug: "lingerie-sets",
      sortOrder: 3,
      subcategories: [
        { name: "فانتزی", slug: "fancy-sets", sortOrder: 1 },
        { name: "گیپور", slug: "lace-sets", sortOrder: 2 },
        { name: "ساتن", slug: "satin-sets", sortOrder: 3 },
      ],
    },
    {
      name: "لباس خواب",
      slug: "sleepwear",
      sortOrder: 4,
      subcategories: [
        { name: "ساتن", slug: "satin-sleepwear", sortOrder: 1 },
        { name: "روبدوشامبر", slug: "robes", sortOrder: 2 },
        { name: "ست نخی", slug: "cotton-sets", sortOrder: 3 },
      ],
    },
    {
      name: "بادی و جوراب",
      slug: "bodysuits-hosiery",
      sortOrder: 5,
      subcategories: [
        { name: "جوراب", slug: "socks", sortOrder: 1 },
        { name: "جوراب شلواری", slug: "tights", sortOrder: 2 },
        { name: "بند جوراب", slug: "garter-belts", sortOrder: 3 },
        { name: "بادی ساده", slug: "plain-bodysuits", sortOrder: 4 },
        { name: "بادی گیپور", slug: "lace-bodysuits", sortOrder: 5 },
        { name: "بادی فانتزی", slug: "fancy-bodysuits", sortOrder: 6 },
      ],
    },
    {
      name: "لباس ورزشی",
      slug: "sportswear",
      sortOrder: 6,
      subcategories: [
        { name: "نیم‌تنه ورزشی", slug: "sports-bras", sortOrder: 1 },
        { name: "کراپ تاپ", slug: "crop-tops", sortOrder: 2 },
        { name: "لگ ورزشی", slug: "leggings", sortOrder: 3 },
        { name: "ست ورزشی", slug: "activewear-sets", sortOrder: 4 },
      ],
    },
    {
      name: "اکسسوری",
      slug: "accessories",
      sortOrder: 7,
      subcategories: [
        { name: "اکسسوری لباس زیر", slug: "underwear-accessories", sortOrder: 1 },
      ],
    },
  ];

  const categoriesMap: Record<string, string> = {}; // slug -> id
  const subcategoriesMap: Record<string, string> = {}; // slug -> id

  for (const cat of categoriesData) {
    const parent = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        sortOrder: cat.sortOrder,
      },
    });
    categoriesMap[cat.slug] = parent.id;

    for (const sub of cat.subcategories) {
      const child = await prisma.category.create({
        data: {
          name: sub.name,
          slug: sub.slug,
          parentId: parent.id,
          sortOrder: sub.sortOrder,
        },
      });
      subcategoriesMap[sub.slug] = child.id;
    }
  }

  console.log("Created Categories and Subcategories.");

  // 4. Create Products
  const productsData = [
    {
      title: "سوتین گیپور فرانسوی لوکس مدل پامچال",
      slug: "french-lace-luxury-bra-primrose",
      description: "سوتین لوکس فرانسوی دوخته شده از بهترین تور گیپور با تن‌خوری شیک، راحت و فوق‌العاده جذاب. طراحی بدون اسفنج با فنر نگهدارنده قوی جهت فرم‌دهی کاملاً طبیعی و راحت برای استفاده روزمره و مجلسی. پارچه‌های استفاده شده در این محصول ضدحساسیت و بسیار لطیف بوده و دارای استانداردهای بین‌المللی کیفیت می‌باشند. این محصول حس راحتی بی‌نظیری را برای شما به ارمغان می‌آورد و هدیه‌ای بی‌نظیر برای افراد شیک‌پسند است.",
      categoryId: subcategoriesMap["lace-bras"],
      basePrice: 380000, // 380,000 Toman
      published: true,
      featured: true,
      variants: JSON.stringify([
        {
          color: "rose",
          colorName: "صورتی ملایم",
          images: ["/images/bra-luxury.jpg", "/images/set-lace.jpg"],
          sizes: [
            { size: "75B", stock: 12, sku: "BRA-PAM-ROSE-75B", priceOverride: null },
            { size: "75C", stock: 8, sku: "BRA-PAM-ROSE-75C", priceOverride: null },
            { size: "80B", stock: 15, sku: "BRA-PAM-ROSE-80B", priceOverride: null },
            { size: "80C", stock: 0, sku: "BRA-PAM-ROSE-80C", priceOverride: 410000 },
          ],
        },
        {
          color: "cream",
          colorName: "کرم صدفی",
          images: ["/images/bra-luxury.jpg"],
          sizes: [
            { size: "75B", stock: 5, sku: "BRA-PAM-CREAM-75B", priceOverride: null },
            { size: "80B", stock: 10, sku: "BRA-PAM-CREAM-80B", priceOverride: null },
            { size: "80C", stock: 2, sku: "BRA-PAM-CREAM-80C", priceOverride: 410000 },
          ],
        },
      ]),
      faq: JSON.stringify([
        { question: "آیا این سوتین پد دارد؟", answer: "خیر، این مدل یک سوتین گیپور بدون پد و اسفنج است ولی دارای فنر نگهدارنده می‌باشد تا فرم سینه‌ها را به بهترین شکل حفظ کند." },
        { question: "راهنمای شستشوی این محصول چیست؟", answer: "توصیه می‌شود این محصول را به صورت دستی، با آب سرد و شوینده ملایم بشویید و از انداختن آن در ماشین لباسشویی خودداری کنید." },
      ]),
    },
    {
      title: "ست شورت نخی ضد حساسیت پنبه‌ای صد درصد",
      slug: "pure-cotton-hypoallergenic-panties-set",
      description: "مجموعه ۵ عددی شورت‌های نخی زنانه با کیفیت سوپر پنبه ضدحساسیت و بسیار لطیف. ایده‌آل برای استفاده طولانی مدت روزانه بدون نگرانی از ایجاد رطوبت یا حساسیت‌های پوستی. کشسانی عالی و لبه‌های دوزی شده نرم جهت عدم ایجاد خط روی پوست بدن. با رنگ‌بندی‌های طبیعی، ملایم و جذاب متناسب با هر سلیقه.",
      categoryId: subcategoriesMap["cotton-panties"],
      basePrice: 195000,
      published: true,
      featured: false,
      variants: JSON.stringify([
        {
          color: "pastel",
          colorName: "پک رنگ‌های پاستلی",
          images: ["/images/hero.jpg"],
          sizes: [
            { size: "S", stock: 20, sku: "PNT-COT-PAST-S", priceOverride: null },
            { size: "M", stock: 35, sku: "PNT-COT-PAST-M", priceOverride: null },
            { size: "L", stock: 25, sku: "PNT-COT-PAST-L", priceOverride: null },
            { size: "XL", stock: 15, sku: "PNT-COT-PAST-XL", priceOverride: 210000 },
          ],
        },
      ]),
      faq: JSON.stringify([
        { question: "آیا جنس شورت‌ها کاملاً نخی است؟", answer: "بله، این شورت‌ها از الیاف ۱۰۰٪ پنبه ارگانیک و ضد حساسیت بافته شده‌اند." },
      ]),
    },
    {
      title: "ست لباس زیر گیپور و حریر مدل الیزه",
      slug: "elysee-lace-chiffon-lingerie-set",
      description: "یک ست فوق‌العاده جذاب، لوکس و زنانه شامل سوتین فنردار گیپور و شورت ست توری. طراحی ظریف و فریبنده متمایز با جزئیات نقره‌ای و بندهای قابل تنظیم. احساس نرمی و بی‌وزنی خارق‌العاده روی پوست بدن، طراحی شده برای کسانی که به زیبایی خود در خانه اهمیت می‌دهند. این ست الهام گرفته از کارهای گران‌قیمت برند La Perla فرانسه است.",
      categoryId: subcategoriesMap["lace-sets"],
      basePrice: 650000,
      published: true,
      featured: true,
      variants: JSON.stringify([
        {
          color: "rose-gold",
          colorName: "رزگلد لوکس",
          images: ["/images/set-lace.jpg", "/images/bra-luxury.jpg"],
          sizes: [
            { size: "75B", stock: 10, sku: "SET-ELY-ROSE-75B", priceOverride: null },
            { size: "80B", stock: 8, sku: "SET-ELY-ROSE-80B", priceOverride: null },
            { size: "85B", stock: 3, sku: "SET-ELY-ROSE-85B", priceOverride: null },
          ],
        },
      ]),
      faq: JSON.stringify([
        { question: "آیا شورت این ست فری‌سایز است؟", answer: "خیر، شورت همگام با سایز سوتین ارسال می‌شود و سایزبندی دقیق استاندارد دارد." },
      ]),
    },
    {
      title: "روبدوشامبر و پیراهن خواب ساتن ابریشم لوکس ماری",
      slug: "marie-silk-satin-robe-sleepwear-set",
      description: "پیراهن خواب ابریشمی بسیار نرم و لطیف همراه با روبدوشامبر بلند آستین‌دار توری‌دوزی شده. براقیت لوکس، الیاف لطیف و دوخت استادانه. انتخابی بی‌نظیر برای تجربه خوابی آرامش‌بخش، راحت و در عین حال شیک و فریبنده. این ست ترکیبی از زیبایی اصیل و مدرن است.",
      categoryId: subcategoriesMap["satin-sleepwear"],
      basePrice: 980000,
      published: true,
      featured: true,
      variants: JSON.stringify([
        {
          color: "ivory",
          colorName: "عاجی براق",
          images: ["/images/sleepwear-satin.jpg"],
          sizes: [
            { size: "S", stock: 5, sku: "SLP-MARI-IVY-S", priceOverride: null },
            { size: "M", stock: 12, sku: "SLP-MARI-IVY-M", priceOverride: null },
            { size: "L", stock: 8, sku: "SLP-MARI-IVY-L", priceOverride: null },
          ],
        },
      ]),
      faq: JSON.stringify([
        { question: "آیا قد روبدوشامبر بلند است؟", answer: "بله، قد روبدوشامبر تا زیر زانو طراحی شده است و تن‌خوری بسیار لوکس و متین دارد." },
      ]),
    },
    {
      title: "بادی آستین‌دار گیپور مجلسی فانتزی",
      slug: "fancy-long-sleeve-lace-bodysuit",
      description: "بادی یقه گرد آستین‌دار دوخته شده از توری گیپور نقش‌برجسته بسیار لطیف و منعطف. فاق قزن‌دار با دکمه‌های باکیفیت و مستحکم. ایده آل برای استفاده زیر کت‌های مجلسی، سارافون یا تن‌پوش‌های خاص خانگی. کشسانی عالی و انطباق کامل با ارگونومی بدن زنانه.",
      categoryId: subcategoriesMap["lace-bodysuits"],
      basePrice: 480000,
      published: true,
      featured: false,
      variants: JSON.stringify([
        {
          color: "black",
          colorName: "مشکی ذغالی",
          images: ["/images/set-lace.jpg"],
          sizes: [
            { size: "M", stock: 15, sku: "BDY-LAC-BLK-M", priceOverride: null },
            { size: "L", stock: 10, sku: "BDY-LAC-BLK-L", priceOverride: null },
          ],
        },
      ]),
      faq: JSON.stringify([
        { question: "آیا در زیر این بادی باید سوتین پوشیده شود؟", answer: "بسته به سلیقه شما دارد؛ بخش جلویی بادی دارای لایه توری ضخیم‌تر ضد دید است اما می‌توانید از سوتین‌های همرنگ یا کرم زیر آن استفاده کنید." },
      ]),
    },
    {
      title: "ست نیم‌تنه و لگ ورزشی سیملس پرو",
      slug: "seamless-pro-sports-bra-leggings-set",
      description: "ست ورزشی زنانه بدون درز (Seamless) شامل نیم‌تنه با پد متحرک و لگ فاق بلند کمر پهن گن‌دار. ساخته شده از متریال با تنفس بالا و قابلیت خشک‌شوندگی سریع. ایده‌آل برای تمرینات بدنسازی، یوگا، پیلاتس و دویدن بدون ایجاد محدودیت حرکتی.",
      categoryId: subcategoriesMap["activewear-sets"],
      basePrice: 720000,
      published: true,
      featured: false,
      variants: JSON.stringify([
        {
          color: "sage-green",
          colorName: "سبز سدری",
          images: ["/images/hero.jpg"],
          sizes: [
            { size: "S", stock: 8, sku: "SPT-SEAM-SGE-S", priceOverride: null },
            { size: "M", stock: 14, sku: "SPT-SEAM-SGE-M", priceOverride: null },
            { size: "L", stock: 5, sku: "SPT-SEAM-SGE-L", priceOverride: null },
          ],
        },
      ]),
      faq: JSON.stringify([
        { question: "آیا لگ این ست خاصیت گن‌کنندگی دارد؟", answer: "بله، کمر لگ دارای پهنای ۱۰ سانتی‌متری گن‌دار جهت جمع کردن شکم و پهلو و فرم‌دهی باسن است." },
      ]),
    },
  ];

  for (const prod of productsData) {
    await prisma.product.create({
      data: prod,
    });
  }

  console.log("Created Products.");

  // 5. Create Articles
  const articlesData = [
    // Bras Category (2 articles)
    {
      title: "راهنمای جامع اندازه گیری و انتخاب سایز سوتین مناسب",
      slug: "ultimate-guide-to-bra-sizing",
      excerpt: "انتخاب سایز سوتین نامناسب علاوه بر ایجاد ظاهر ناخوشایند، سلامت فیزیکی شما را به خطر می‌اندازد. در این مقاله به صورت گام به گام و علمی روش صحیح اندازه گیری بند سینه و کاپ را آموزش می‌دهیم.",
      content: `<h2>چرا انتخاب سایز سوتین مناسب حیاتی است؟</h2>
<p>مطالعات نشان می‌دهند که بیش از ۸۰ درصد از زنان در سراسر جهان از سوتین‌های با سایز اشتباه استفاده می‌کنند. این اشتباه فقط به راحتی ربطی ندارد، بلکه می‌تواند باعث دردهای مزمن در ناحیه کتف، شانه، گردن و کمر شود. انتخاب سوتینی با سایز دقیق، سینه‌ها را بالا نگه داشته و فشار را از روی عضلات گردن و ستون فقرات برمی‌دارد.</p>

<h3>جدول محتویات</h3>
<ul>
  <li><a href="#step1">مرحله اول: اندازه گیری دور زیر سینه (Band Size)</a></li>
  <li><a href="#step2">مرحله دوم: اندازه گیری دور برجسته‌ترین بخش سینه (Cup Size)</a></li>
  <li><a href="#step3">مرحله سوم: محاسبه تفاوت و به دست آوردن کاپ سوتین</a></li>
  <li><a href="#tips">نکات کلیدی در هنگام پرو سوتین جدید</a></li>
</ul>

<h3 id="step1">مرحله اول: اندازه گیری دور زیر سینه (بند سوتین)</h3>
<p>یک متر نواری بردارید و آن را درست زیر سینه خود، جایی که بند سوتین قرار می‌گیرد، به دور بدن بپیچید. متر باید کاملاً صاف و مماس با پوست باشد اما خیلی سفت کشیده نشود. نفس خود را بیرون بدهید و عدد را به سانتی‌متر یادداشت کنید. در سایزبندی استاندارد ایرانی و اروپایی، این اندازه معمولاً مضربی از ۵ است (مثل ۷۰، ۷۵، ۸۰، ۸۵).</p>

<h3 id="step2">مرحله دوم: اندازه گیری دور برجسته‌ترین بخش سینه</h3>
<p>متر را در موازی با زمین دور بدن بچرخانید و آن را روی برجسته‌ترین قسمت سینه قرار دهید. مطمئن شوید متر کج نشده و فشاری به سینه وارد نمی‌کند. عدد به دست آمده به سانتی‌متر را یادداشت کنید.</p>

<h3 id="step3">مرحله سوم: محاسبه کاپ سوتین (A, B, C, D)</h3>
<p>تفاوت بین اندازه دور برجسته و زیر سینه، سایز کاپ شما را مشخص می‌کند. به طور کلی، تفاوت حدود ۱۲ تا ۱۴ سانتی‌متر به معنای کاپ A، تفاوت ۱۴ تا ۱۶ سانتی‌متر کاپ B، تفاوت ۱۶ تا ۱۸ سانتی‌متر کاپ C و تفاوت ۱۸ تا ۲۰ سانتی‌متر کاپ D است.</p>

<h3 id="tips">نکات طلایی خرید سوتین</h3>
<p>وقتی یک سوتین نو می‌پوشید، همیشه آن را روی گشادترین قزن ببندید تا به مرور زمان که کش آمد، بتوانید آن را تنگ‌تر کنید. بندهای شانه نباید روی پوست شما خط بیندازند؛ بیشتر وزن سینه باید توسط بند پشتی (زیر سینه) تحمل شود، نه بندهای روی شانه.</p>`,
      featuredImage: "/images/bra-luxury.jpg",
      categoryId: categoriesMap["bras"],
      metaTitle: "راهنمای جامع اندازه‌گیری سایز سوتین استاندارد | لباس‌زیرزنانه",
      metaDescription: "چگونه سایز سوتین دقیق خود را پیدا کنیم؟ راهنمای گام به گام اندازه گیری دور سینه و کاپ به زبان ساده همراه با جدول سایز استاندارد.",
      canonicalUrl: "https://lebaszirzanane.ir/blog/ultimate-guide-to-bra-sizing",
      indexStatus: true,
      publishStatus: "Published",
    },
    {
      title: "تفاوت سوتین فنردار و بدون فنر: کدام یک برای شما مناسب‌تر است؟",
      slug: "underwired-vs-wireless-bras",
      excerpt: "انتخاب بین سوتین‌های فنردار و بدون فنر همیشه چالش‌برانگیز بوده است. در این مقاله به بررسی مزایا، معایب و کاربرد هر کدام می‌پردازیم تا بهترین انتخاب را برای استایل و راحتی خود داشته باشید.",
      content: `<h2>مقدمه</h2>
<p>هر زنی در کمد لباس خود به انواع مختلفی از سوتین‌ها نیاز دارد. دو دسته بندی اصلی سوتین‌ها شامل مدل‌های فنردار (Underwired) و بدون فنر (Wireless یا Soft Cup) هستند. هر کدام از این مدل‌ها برای شرایط خاصی طراحی شده‌اند و ویژگی‌های منحصر به فردی دارند.</p>

<h3>جدول محتویات</h3>
<ul>
  <li><a href="#underwired">سوتین فنردار چیست و چه مزایایی دارد؟</a></li>
  <li><a href="#wireless">سوتین بدون فنر چیست و چه مزایایی دارد؟</a></li>
  <li><a href="#comparison">جدول مقایسه جامع بر اساس کاربرد</a></li>
  <li><a href="#verdict">نتیجه‌گیری نهایی</a></li>
</ul>

<h3 id="underwired">سوتین فنردار: پادشاه فرم‌دهی و لیفت</h3>
<p>سوتین‌های فنردار دارای یک نیم‌دایره فلزی یا پلاستیکی سخت در زیر کاپ‌ها هستند. وظیفه اصلی این فنر، تقسیم وزن سینه‌ها و توزیع آن در سراسر بند سوتین است. این ویژگی باعث لیفت عالی، فرم‌دهی گرد و مجزا نشان دادن سینه‌ها می‌شود. سوتین‌های فنردار گزینه‌ای فوق‌العاده برای لباس‌های مجلسی و سینه‌های بزرگ هستند.</p>

<h3 id="wireless">سوتین بدون فنر: اوج راحتی و آزادی</h3>
<p>سوتین‌های بدون فنر فاقد هرگونه ساختار سخت فلزی هستند و کاملاً از پارچه‌های منعطف و کشسان دوخته می‌شوند. این مدل‌ها راحتی بی‌نظیری را ارائه می‌دهند و هیچ فشاری به قفسه سینه وارد نمی‌کنند. برای استفاده روزمره، محیط کار، زمان خواب و استراحت در خانه، سوتین‌های بدون فنر بهترین انتخاب هستند.</p>

<h3 id="comparison">کدام را انتخاب کنیم؟</h3>
<p>اگر به دنبال فرم‌دهی شیک در مجالس هستید، قطعاً مدل‌های فنردار پیشنهاد می‌شود. اما اگر اولویت اول شما سلامتی، راحتی و استفاده طولانی‌مدت روزمره است، بدون تردید مدل‌های نخی بدون فنر را انتخاب کنید. برندهایی مثل SKIMS امروزه مدل‌های بدون فنر با تکنولوژی جدید تولید می‌کنند که فرم‌دهی بسیار خوبی نیز دارند.</p>`,
      featuredImage: "/images/bra-luxury.jpg",
      categoryId: categoriesMap["bras"],
      metaTitle: "سوتین فنردار بخریم یا بدون فنر؟ مقایسه و راهنما | لباس‌زیرزنانه",
      metaDescription: "بررسی تفاوت‌ها، مزایا و معایب سوتین‌های فنردار و بدون فنر. کدام مدل برای سلامت سینه و راحتی روزمره بهتر است؟",
      canonicalUrl: "https://lebaszirzanane.ir/blog/underwired-vs-wireless-bras",
      indexStatus: true,
      publishStatus: "Published",
    },

    // Panties Category (2 articles)
    {
      title: "بهترین الیاف برای شورت زنانه: چرا پنبه پادشاه بی‌رقیب است؟",
      slug: "best-fabrics-for-womens-panties-cotton",
      excerpt: "جنس شورت زنانه ارتباط مستقیمی با بهداشت و سلامت دستگاه تناسلی بانوان دارد. در این مقاله به اهمیت الیاف پنبه و مقایسه آن با پارچه‌های مصنوعی می‌پردازیم.",
      content: `<h2>سلامت و بهداشت لباس زیر</h2>
<p>پزشکان متخصص زنان همواره تاکید دارند که انتخاب نادرست لباس زیر می‌تواند عامل اصلی بسیاری از عفونت‌های قارچی و پوستی مکرر در زنان باشد. شورت‌ها به دلیل تماس مستقیم و مداوم با حساس‌ترین نقاط بدن، باید از پارچه‌هایی دوخته شوند که اجازه گردش آزادانه هوا را بدهند و رطوبت را به خود جذب کنند.</p>

<h3>جدول محتویات</h3>
<ul>
  <li><a href="#cotton">چرا پنبه بهترین پارچه برای شورت است؟</a></li>
  <li><a href="#synthetic">خطرات پارچه‌های نایلونی و مصنوعی</a></li>
  <li><a href="#daily-care">نکات مهم بهداشتی در استفاده روزانه</a></li>
</ul>

<h3 id="cotton">چرا پنبه (نخی) بهترین گزینه است؟</h3>
<p>پنبه یا کتان یک فیبر طبیعی است که رطوبت را به سرعت جذب کرده و آن را تبخیر می‌کند. این امر باعث می‌شود که محیط واژن خشک و خنک بماند و از رشد باکتری‌ها و قارچ‌ها که عاشق گرما و رطوبت هستند، جلوگیری شود. شورت‌های نخی همچنین بسیار نرم بوده و از اصطکاک و ساییدگی روی پوست جلوگیری می‌کنند.</p>

<h3 id="synthetic">مضرات الیاف پلی‌استر و پلاستیکی</h3>
<p>الیاف مصنوعی مانند پلی‌استر، نایلون و اکریلیک، رطوبت را در خود حبس می‌کنند و مانع از گردش هوا می‌شوند. این امر یک اثر گلخانه‌ای کوچک در لباس زیر ایجاد می‌کند که مستعدترین محیط برای عفونت و ایجاد بوی نامطبوع است. مدل‌های فانتزی پلاستیکی فقط باید برای ساعات محدود استفاده شوند، نه به عنوان شورت روزمره.</p>`,
      featuredImage: "/images/hero.jpg",
      categoryId: categoriesMap["panties"],
      metaTitle: "چرا باید شورت نخی پنبه‌ای بپوشیم؟ مزایا و نکات بهداشتی",
      metaDescription: "توصیه پزشکان زنان درباره انتخاب جنس لباس زیر. چرا شورت‌های ۱۰۰٪ پنبه بهترین انتخاب برای بهداشت شخصی و پیشگیری از عفونت هستند؟",
      canonicalUrl: "https://lebaszirzanane.ir/blog/best-fabrics-for-womens-panties-cotton",
      indexStatus: true,
      publishStatus: "Published",
    },
    {
      title: "راهنمای شستشو و نگهداری از شورت‌های توری و فانتزی ظریف",
      slug: "how-to-wash-delicate-lace-panties",
      excerpt: "شورت‌های فانتزی، گیپور و توری به دلیل ظرافت بالا در شستشوهای نامناسب ماشین لباسشویی خیلی زود خراب می‌شوند. در این مطلب ترفندهای شستشوی دستی و ایمن را مرور می‌کنیم.",
      content: `<h2>مقدمه</h2>
<p>لباس‌های زیر فانتزی و توری سرمایه‌گذاری‌های زیبایی در استایل شخصی ما هستند، اما نگهداری از آن‌ها مهارت خاص خود را می‌طلبد. یک شستشوی اشتباه با ماشین لباسشویی می‌تواند تورهای ظریف را پاره کرده، کش‌ها را شل کند یا رنگ آن‌ها را تغییر دهد.</p>

<h3>جدول محتویات</h3>
<ul>
  <li><a href="#wash">شستشوی دستی: بهترین روش برای تورهای ظریف</a></li>
  <li><a href="#machine">اگر مجبور به استفاده از ماشین لباسشویی هستیم چه کنیم؟</a></li>
  <li><a href="#dry">روش صحیح خشک کردن لباس زیر لوکس</a></li>
</ul>

<h3 id="wash">شستشوی دستی گام به گام</h3>
<p>یک تشت کوچک را با آب ولرم (رو به سرد) پر کنید و یک قاشق چایخوری شوینده ملایم مایع (یا شامپوی بچه) در آن بریزید. لباس زیر را به مدت ۱۰ تا ۱۵ دقیقه در آن خیس کنید. سپس با ملایمت و بدون چنگ زدن یا چلاندن شدید، آن را ماساژ دهید. در نهایت با آب سرد آبکشی کنید.</p>

<h3 id="machine">استفاده ایمن از ماشین لباسشویی</h3>
<p>اگر وقت کافی برای شستشوی دستی ندارید، حتماً از کیسه‌های مخصوص شستشوی لباس زیر (کیسه توری) استفاده کنید. این کیسه‌ها مانع از گره خوردن بندها و گیر کردن قلاب‌ها به سایر لباس‌ها می‌شوند. تنظیمات ماشین را روی دور ملایم (Delicate) و دمای آب را روی ۳۰ درجه قرار دهید.</p>`,
      featuredImage: "/images/hero.jpg",
      categoryId: categoriesMap["panties"],
      metaTitle: "روش صحیح شستن لباس زیر توری و ابریشمی | نگهداری لباس لوکس",
      metaDescription: "چگونه طول عمر شورت و سوتین‌های فانتزی را افزایش دهیم؟ راهنمای کامل شستشوی دستی و ماشینی بدون آسیب به بافت پارچه.",
      canonicalUrl: "https://lebaszirzanane.ir/blog/how-to-wash-delicate-lace-panties",
      indexStatus: true,
      publishStatus: "Published",
    },

    // Lingerie Sets (2 articles)
    {
      title: "ست‌های لباس زیر توری لوکس: مظهر زیبایی، جذابیت و اعتماد به نفس",
      slug: "lace-lingerie-sets-elegance-and-confidence",
      excerpt: "پوشیدن یک ست لباس زیر هماهنگ، شیک و زیبا بیش از آنکه روی دید دیگران تاثیر بگذارد، حس اعتماد به نفس و ارزشمندی درونی شما را تقویت می‌کند. راهنمای خرید ست لوکس.",
      content: `<h2>جادوی ست‌های هماهنگ</h2>
<p>بسیاری از خانم‌ها تصور می‌کنند لباس زیر لوکس و ست فقط برای مناسبت‌های خاص است. اما روانشناسان مد عقیده دارند که پوشیدن یک ست هماهنگ و باکیفیت حتی زیر ساده‌ترین لباس‌های روزمره، تاثیر شگرفی بر زبان بدن، حس رضایت شخصی و سلف‌استیم (عزت نفس) فرد دارد.</p>

<h3>جدول محتویات</h3>
<ul>
  <li><a href="#psychology">تاثیر روانشناختی لباس زیر هماهنگ</a></li>
  <li><a href="#lace">چرا گیپور و تور نماد کلاسیک لوکس بودن هستند؟</a></li>
  <li><a href="#selection">چگونه ست مناسب فرم بدنی خود را بخریم؟</a></li>
</ul>

<h3 id="psychology">قدرت پنهان لباس زیر</h3>
<p>وقتی شما برای درونی‌ترین لایه پوشش خود ارزش قائل می‌شوید و از رنگ‌ها و طرح‌های باکیفیت و هماهنگ استفاده می‌کنید، پیامی از ارزشمندی به ذهن خود مخابره می‌کنید. این حس خوددوستی، در طول روز به شکل افزایش اعتماد به نفس در رفتارهای اجتماعی شما متجلی می‌شود.</p>`,
      featuredImage: "/images/set-lace.jpg",
      categoryId: categoriesMap["lingerie-sets"],
      metaTitle: "تاثیر شگفت‌انگیز پوشیدن ست لباس زیر لوکس بر اعتماد به نفس زنانه",
      metaDescription: "چرا روانشناسان توصیه می‌کنند همواره ست‌های هماهنگ و باکیفیت بپوشیم؟ بررسی رابطه خوددوستی و انتخاب لباس زیر شیک.",
      canonicalUrl: "https://lebaszirzanane.ir/blog/lace-lingerie-sets-elegance-and-confidence",
      indexStatus: true,
      publishStatus: "Published",
    },
    {
      title: "روانشناسی رنگ‌ها در انتخاب و خرید ست لباس زیر زنانه",
      slug: "color-psychology-in-womens-lingerie",
      excerpt: "هر رنگی در لباس زیر پیام حسی خاصی دارد. از قرمز آتشین و مشکی کلاسیک تا سفید پاک و رز ملایم؛ چگونه رنگ‌ها حس و حال ما را دگرگون می‌کنند؟",
      content: `<h2>زبان رنگ‌ها در کمد لباس زیر</h2>
<p>رنگ‌ها ابزاری قدرتمند برای ابراز احساسات بدون کلام هستند. انتخاب رنگ ست لباس زیر بازتابی از روحیات فعلی شما یا حالتی است که می‌خواهید به آن دست یابید. در این مقاله به دنیای اسرارآمیز روانشناسی رنگ‌ها در حیطه لباس زیر زنانه سفر می‌کنیم.</p>

<h3>جدول محتویات</h3>
<ul>
  <li><a href="#red-black">مشکی و قرمز: نمادهای جذابیت و قدرت</a></li>
  <li><a href="#cream-pink">کرم، نود و صورتی ملایم: آرامش، متانت و راحتی</a></li>
  <li><a href="#white">سید و رنگ‌های روشن: پاکی و انرژی مثبت</a></li>
</ul>

<h3 id="red-black">قدرت‌نمایی با مشکی و قرمز</h3>
<p>رنگ مشکی نماد ابهام، ظرافت، لاغری و اقتدار است و برای هر نوع رنگ پوستی جذابیت دارد. رنگ قرمز نیز ضربان قلب را بالا برده و نماد شور، اشتیاق و جسارت است. ست‌های قرمز و مشکی همواره در صدر پرفروش‌ترین رنگ‌های لباس زیر فانتزی قرار دارند.</p>`,
      featuredImage: "/images/set-lace.jpg",
      categoryId: categoriesMap["lingerie-sets"],
      metaTitle: "روانشناسی رنگ‌ها در خرید لباس زیر زنانه | کدام رنگ مناسب شماست؟",
      metaDescription: "معنی رنگ‌های مختلف در ست‌های لباس زیر چیست؟ چگونه رنگ مناسب پوست و روحیه خود را انتخاب کنیم؟ تحلیل رنگ‌های نود، قرمز و صورتی.",
      canonicalUrl: "https://lebaszirzanane.ir/blog/color-psychology-in-womens-lingerie",
      indexStatus: true,
      publishStatus: "Published",
    },

    // Sleepwear (1 article)
    {
      title: "چرا لباس خواب ساتن ابریشم بهترین سرمایه‌گذاری برای پوست و کیفیت خواب شماست؟",
      slug: "benefits-of-satin-and-silk-sleepwear",
      excerpt: "آیا می‌دانید جنس لباس خواب شما بر کیفیت خواب عمیق و جوانی پوست صورت و بدنتان اثرگذار است؟ در این مقاله فواید شگفت‌انگیز ساتن ابریشم را بررسی می‌کنیم.",
      content: `<h2>خوابی به سبکی پر</h2>
<p>خواب کافی و باکیفیت، پایه و اساس سلامتی، زیبایی و بازسازی سلول‌های پوست است. لباس خوابی که برای استراحت شبانه انتخاب می‌کنید، نقشی کلیدی در این فرآیند بازی می‌کند. پارچه ساتن ابریشم به دلیل بافت لطیف و ویژگی‌های فیزیولوژیکی منحصربه‌فرد، توسط متخصصان پوست و مو به شدت توصیه می‌شود.</p>

<h3>جدول محتویات</h3>
<ul>
  <li><a href="#skin">جلوگیری از چین و چروک پوستی و پیری زودرس</a></li>
  <li><a href="#hair">کاهش وز و گره خوردگی موها در هنگام خواب</a></li>
  <li><a href="#temperature">تنظیم طبیعی دمای بدن در فصول مختلف</a></li>
</ul>

<h3 id="skin">۱. خداحافظی با چروک‌های شبانه پوست</h3>
<p>پارچه‌های نخی زبر در حین غلت زدن روی پوست صورت و بدن سایش ایجاد کرده و به مرور زمان موجب عمیق‌تر شدن خطوط پوستی و ایجاد چروک می‌شوند. ساتن ابریشم به دلیل سطح لغزنده و فوق‌العاده نرم خود، بدون هیچ‌گونه اصطکاکی روی پوست سر می‌خورد و شادابی پوست شما را در طول شب حفظ می‌کند.</p>

<h3 id="hair">۲. موهایی نرم و بدون گره</h3>
<p>سایش موها با بالش و لباس‌های زبر، کوتیکول مو را تخریب کرده و باعث وز شدن، موخوره و گره خوردگی موها می‌شود. خوابیدن با لباس خواب و روبالشی ساتن، به موهای شما اجازه می‌دهد آزادانه حرکت کنند و رطوبت طبیعی ساقه مو حفظ شود.</p>`,
      featuredImage: "/images/sleepwear-satin.jpg",
      categoryId: categoriesMap["sleepwear"],
      metaTitle: "فواید علمی و بهداشتی پوشیدن لباس خواب ساتن ابریشم | زیبایی پوست",
      metaDescription: "چرا لباس خواب‌های ابریشمی و ساتن از ایجاد چروک پوست و وز شدن موها جلوگیری می‌کنند؟ بررسی تاثیر جنس لباس خواب بر کیفیت خواب.",
      canonicalUrl: "https://lebaszirzanane.ir/blog/benefits-of-satin-and-silk-sleepwear",
      indexStatus: true,
      publishStatus: "Published",
    },

    // Bodysuits & Hosiery (1 article)
    {
      title: "راهنمای استایل کردن بادی‌های فانتزی و توری با لباس‌های روزمره",
      slug: "styling-guide-fancy-lace-bodysuits",
      excerpt: "بادی‌ها دیگر فقط یک لباس زیر نیستند! امروزه بادی‌های توری و فانتزی به یکی از جذاب‌ترین آیتم‌های مد برای استایل‌های خیابانی و مجلسی زیر کت تبدیل شده‌اند.",
      content: `<h2>بادی؛ ترند همه‌کاره کمد لباس خانم‌ها</h2>
<p>بادی (Bodysuit) به دلیل چسبان بودن و صاف ایستادن در کمر شلوار یا دامن، محبوبیت بسیار زیادی دارد. تلفیق بادی‌های توری مجلسی با لباس‌های کژوال یا نیمه‌رسمی، تضادی بی‌نظیر و به شدت جذاب ایجاد می‌کند که نظر هر بیننده‌ای را به خود جلب می‌سازد.</p>

<h3>جدول محتویات</h3>
<ul>
  <li><a href="#blazer">ترکیب طلایی بادی توری و کت بلیزر رسمی</a></li>
  <li><a href="#denim">تضاد جذاب بادی فانتزی با شلوارهای جین زاپ‌دار کژوال</a></li>
  <li><a href="#acc">نقش اکسسوری‌ها در تکمیل استایل با بادی</a></li>
</ul>

<h3 id="blazer">۱. استایل بادی توری زیر کت و شلوار</h3>
<p>یکی از شیک‌ترین استایل‌های ترند سال، پوشیدن یک بادی گیپور یا توری مشکی در زیر یک کت تک اوورسایز یا کت و شلوار مونوکروم (تک رنگ) است. این استایل هم‌زمان حس قدرت و زنانگی ظریف را تداعی می‌کند و انتخابی عالی برای مهمانی‌ها و دورهمی‌های شیک است.</p>`,
      featuredImage: "/images/set-lace.jpg",
      categoryId: categoriesMap["bodysuits-hosiery"],
      metaTitle: "چگونه بادی توری و فانتزی را ست کنیم؟ ایده استایلینگ ترند",
      metaDescription: "روش‌های شیک ست کردن بادی آستین‌دار توری زیر کت مجلسی، با شلوار جین و دامن‌های چرم. راهنمای کاربردی مد و ترند لباس زنانه.",
      canonicalUrl: "https://lebaszirzanane.ir/blog/styling-guide-fancy-lace-bodysuits",
      indexStatus: true,
      publishStatus: "Published",
    },

    // Sportswear (1 article)
    {
      title: "اهمیت حیاتی انتخاب و استفاده از نیم‌تنه ورزشی مناسب در حین تمرین",
      slug: "importance-of-proper-sports-bra-in-workout",
      excerpt: "تمرین ورزشی بدون سوتین یا نیم‌تنه ورزشی مناسب می‌تواند آسیب‌های جبران‌ناپذیری به بافت‌های همبند سینه (رباط‌های کوپر) وارد کند و باعث افتادگی زودرس شود.",
      content: `<h2>رباط‌های کوپر را جدی بگیرید!</h2>
<p>بسیاری از خانم‌ها در هنگام رفتن به باشگاه بدنسازی یا کلاس یوگا، از همان سوتین‌های معمولی روزمره خود استفاده می‌کنند. این یک اشتباه بزرگ بهداشتی و ورزشی است. سینه‌ها فاقد هرگونه بافت عضلانی هستند و تنها توسط رباط‌های ظریفی به نام رباط کوپر نگهداری می‌شوند. تکان‌های شدید در تمرینات ورزشی بدون حمایت کافی، کشیدگی دائمی و شل شدن این رباط‌ها را در پی دارد.</p>

<h3>جدول محتویات</h3>
<ul>
  <li><a href="#why">چرا سوتین معمولی برای ورزش مناسب نیست؟</a></li>
  <li><a href="#types">انواع نیم‌تنه‌های ورزشی بر اساس میزان ضربه‌گیری (Low, Medium, High Impact)</a></li>
  <li><a href="#fit">ویژگی‌های یک نیم‌تنه ورزشی باکیفیت استاندارد</a></li>
</ul>

<h3 id="why">خطرات ورزش با سوتین معمولی</h3>
<p>سوتین‌های معمولی توانایی مهار حرکات نوسانی سینه در حین دویدن، پرش یا حتی پیاده‌روی سریع را ندارند. این تکان‌ها علاوه بر درد گرفتن سینه، باعث کشیده شدن پوست و بافت سینه شده و روند افتادگی را به شدت تسریع می‌کند. نیم‌تنه‌های ورزشی با ایجاد فشار ملایم و یکنواخت، سینه را به قفسه سینه چسبانده و مانع از حرکت آونگی آن می‌شوند.</p>`,
      featuredImage: "/images/hero.jpg",
      categoryId: categoriesMap["sportswear"],
      metaTitle: "چرا استفاده از نیم‌تنه ورزشی در باشگاه اجباری است؟ | سلامت سینه",
      metaDescription: "پیشگیری از افتادگی سینه با نیم‌تنه ورزشی استاندارد. بررسی خطرات تمرینات پرشی و دویدن با سوتین معمولی برای خانم‌ها.",
      canonicalUrl: "https://lebaszirzanane.ir/blog/importance-of-proper-sports-bra-in-workout",
      indexStatus: true,
      publishStatus: "Published",
    },

    // Accessories (1 article)
    {
      title: "نقش اکسسوری‌ها و بند جوراب در تکامل و ایجاد ست‌های لباس زیر لوکس",
      slug: "role-of-garter-belts-and-accessories-in-luxury-lingerie",
      excerpt: "چگونه اکسسوری‌های کوچکی مانند بند جوراب، زنجیرهای بدن و پدهای سیلیکونی می‌توانند استایل لباس زیر شما را از معمولی به یک اثر هنری لوکس و فریبنده ارتقا دهند؟",
      content: `<h2>جزئیاتی که تفاوت‌ها را خلق می‌کنند</h2>
<p>در دنیای مد و لباس زیر زنانه لوکس، جزئیات حرف اول را می‌زنند. اکسسوری‌های لباس زیر صرفاً جنبه تزیینی ندارند، بلکه مکمل‌هایی هستند که به استایل شما عمق، اصالت و تمایز می‌بخشند. بند جوراب (Garter Belt) یکی از قدیمی‌ترین و فریبنده‌ترین این اکسسوری‌هاست.</p>

<h3>جدول محتویات</h3>
<ul>
  <li><a href="#garter">تاریخچه و روش استفاده از بند جوراب و جوراب گیر</a></li>
  <li><a href="#silicone">اکسسوری‌های کاربردی: پدهای سیلیکونی و چسب‌های سینه</a></li>
  <li><a href="#jewelry">زنجیرهای بدن ظریف مخصوص لباس زیر</a></li>
</ul>

<h3 id="garter">بند جوراب: تلفیق اصالت و جذابیت</h3>
<p>بند جوراب در ابتدا به عنوان یک وسیله کاربردی برای نگه داشتن جوراب‌های بلند زنانه استفاده می‌شد، اما امروزه به یکی از ارکان اصلی ست‌های جذاب اتاق خواب تبدیل شده است. بستن بند جوراب روی باسن و اتصال آن به جوراب شلواری یا جوراب‌های ساق بلند، پاها را کشیده‌تر و خوش‌فرم‌تر نشان می‌دهد.</p>`,
      featuredImage: "/images/contact.jpg",
      categoryId: categoriesMap["accessories"],
      metaTitle: "راهنمای خرید و بستن بند جوراب زنانه لوکس | اکسسوری لباس زیر",
      metaDescription: "چگونه از بند جوراب در ست‌های فانتزی استفاده کنیم؟ کاربردهای جالب چسب سینه و اکسسوری‌های مکمل برای استایل‌های مجلسی بی‌پشت.",
      canonicalUrl: "https://lebaszirzanane.ir/blog/role-of-garter-belts-and-accessories-in-luxury-lingerie",
      indexStatus: true,
      publishStatus: "Published",
    },
  ];

  for (const art of articlesData) {
    await prisma.article.create({
      data: art,
    });
  }

  console.log("Created Articles.");

  // 6. Create Discount Codes
  const discountCodes = [
    {
      code: "WELCOME",
      type: "Percent",
      value: 10, // 10% discount
      startsAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      usageLimit: 100,
      timesUsed: 0,
      isActive: true,
    },
    {
      code: "VIP50",
      type: "Fixed",
      value: 50000, // 50,000 Toman flat discount
      startsAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
      usageLimit: 50,
      timesUsed: 0,
      isActive: true,
    },
  ];

  for (const code of discountCodes) {
    await prisma.discountCode.create({
      data: code,
    });
  }

  console.log("Created Discount Codes.");

  // 7. Create some Reviews for products
  const products = await prisma.product.findMany();
  if (products.length > 0) {
    await prisma.review.create({
      data: {
        userId: customerUser.id,
        productId: products[0].id,
        rating: 5,
        comment: "فوق‌العاده لطیف و خوش‌قواره است. بند پشتی پهنی داره و واقعا فشار رو از شونه‌ها برمی‌داره. ارزش خرید بالایی داره و حتماً رنگ دیگه‌اش رو هم سفارش میدم.",
        moderationStatus: "Approved",
      },
    });

    await prisma.review.create({
      data: {
        userId: customerUser.id,
        productId: products[0].id,
        rating: 4,
        comment: "دوخت خیلی تمیزی داره. فقط کاپش برای من یکمی کوچیک بود که مرجوع کردم و سایز بزرگتر برداشتم. پشتیبانی بسیار بااخلاق و مودبانه مرجوعی رو انجام دادن.",
        moderationStatus: "Approved",
      },
    });
  }

  console.log("Created Reviews.");
  console.log("Database Seeding Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
