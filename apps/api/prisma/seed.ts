import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Al-Waheed Platform Database...');

  // 1. Initial Admin User
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'Admin@AlWaheed2026!';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@alwaheed-stone.com' },
    update: {
      passwordHash: hashedPassword,
      name: 'المهندس مدير النظام - الوحيد',
      role: 'SUPER_ADMIN',
    },
    create: {
      email: 'admin@alwaheed-stone.com',
      name: 'المهندس مدير النظام - الوحيد',
      phone: '+967777360681',
      passwordHash: hashedPassword,
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });
  console.log(`✅ Admin user seeded: ${admin.email}`);

  // 2. Enterprise Settings (Verified Data)
  const settings = [
    { key: 'STORE_NAME_AR', value: 'مؤسسة الوحيد للزخرفة المعمارية ونحت والمقاولات العامة', group: 'GENERAL', description: 'الاسم الرسمي للمؤسسة بالعربية' },
    { key: 'STORE_NAME_EN', value: 'Al-Waheed for Architectural Ornamentation, Stone Carving & General Contracting', group: 'GENERAL', description: 'الاسم الرسمي بالإنجليزية' },
    { key: 'STORE_PHONE', value: '+967777360681', group: 'CONTACT', description: 'رقم الهاتف المباشر للاتصال والاستفسار' },
    { key: 'STORE_WHATSAPP', value: '+967777360681', group: 'CONTACT', description: 'رقم الواتساب الرسمي للمبيعات والتسعير' },
    { key: 'STORE_LOCATION', value: 'حده - فج عطان، صنعاء، الجمهورية اليمنية', group: 'CONTACT', description: 'الموقع الجغرافي للمقر والورش' },
    { key: 'STORE_CURRENCY', value: 'YER', group: 'GENERAL', description: 'العملة الافتراضية لعرض الأسعار' },
    { key: 'BUSINESS_HOURS', value: 'السبت - الخميس: 8:00 صباحاً - 8:00 مساءً | الجمعة: إجازة أسبوعية', group: 'GENERAL', description: 'ساعات العمل الرسمية' },
    { key: 'HERO_TITLE', value: 'نحوّل الحجر الطبيعي إلى صروح معمارية وتحف فنية خالدة', group: 'APPEARANCE', description: 'العنوان الرئيسي لواجهة الموقع' },
    { key: 'HERO_SUBTITLE', value: 'متخصصون في نحت وزخرفة الأحجار الطبيعية والرخام، تنفيذ أرقى الواجهات الحجرية للفلل والقصور، وتشكيل التيجان والأعمدة الملكية بأعلى معايير الحرفية والهندسة.', group: 'APPEARANCE', description: 'الوصف الفرعي لواجهة الموقع' },
    { key: 'FACEBOOK_URL', value: 'https://www.facebook.com/people/%D8%A7%D9%84%D9%88%D8%AD%D9%8A%D8%AF-%D9%84%D9%84%D8%B2%D8%AE%D8%B1%D9%81%D9%87-%D8%A7%D9%84%D9%85%D8%B9%D9%85%D8%A7%D8%B1%D9%8A%D9%87-%D9%88%D9%86%D8%AD%D8%AA-%D9%88%D8%A7%D9%84%D9%85%D9%82%D8%A7%D9%88%D9%84%D8%A7%D8%AA-%D8%A7%D9%84%D8%B9%D8%A7%D9%85%D9%87-%D8%AD%D8%AF%D9%87-%D9%81%D8%AC-%D8%B9%D8%B7%D8%A7%D9%86-770663641/100067643884572/', group: 'SOCIAL', description: 'رابط صفحة فيسبوك الرسمية' },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value, group: s.group, description: s.description },
      create: s,
    });
  }
  console.log(`✅ ${settings.length} Settings seeded.`);

  // 3. Materials (Natural Yemeni Stone & Marble)
  const materials = [
    {
      nameAr: 'حجر حبش صنعاني (أسود / رمادي بركاني)',
      nameEn: 'Sanaani Habash Basalt Stone',
      slug: 'habash-stone',
      origin: 'محاجر صنعاء وضواحيها - اليمن',
      density: '2.85 g/cm³',
      compressiveStrength: '145 MPa',
      waterAbsorption: '0.35%',
      descriptionAr: 'حجر بركاني طبيعي صلب يتميز بمقاومته الفائقة للعوامل الجوية ولونه الأسود والرمادي الفاخر للواجهات والأعمدة.',
      imageUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
    },
    {
      nameAr: 'حجر بيج مأربي فاخر (رملي ناعم)',
      nameEn: 'Maribi Warm Beige Sandstone',
      slug: 'maribi-beige-stone',
      origin: 'محاجر مأرب - اليمن',
      density: '2.55 g/cm³',
      compressiveStrength: '115 MPa',
      waterAbsorption: '0.65%',
      descriptionAr: 'حجر طبيعي بلون رملي دافئ ونقاء عالي، يعتبر الخيار الأول للواجهات المعمارية الكلاسيكية والنقوش الزخرفية.',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    },
    {
      nameAr: 'حجر سيلاني طبيعي',
      nameEn: 'Silani Natural Stone',
      slug: 'silani-stone',
      origin: 'اليمن',
      density: '2.60 g/cm³',
      compressiveStrength: '125 MPa',
      waterAbsorption: '0.40%',
      descriptionAr: 'حجر يماني أصيل متدرج الألوان يجمع بين الصلابة وسهولة التشكيل والنحت الهندسي الدقيق.',
      imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    },
    {
      nameAr: 'حجر أبيض جبلي ناصع',
      nameEn: 'Mountain Pure White Stone',
      slug: 'white-mountain-stone',
      origin: 'اليمن',
      density: '2.50 g/cm³',
      compressiveStrength: '110 MPa',
      waterAbsorption: '0.50%',
      descriptionAr: 'حجر أبيض جبلي ناصع يمنح المباني والفلل طابعاً قصرياً مشرقاً وفخامة استثنائية.',
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    },
    {
      nameAr: 'رخام طبيعي عالي النقاء',
      nameEn: 'Natural Luxury Marble',
      slug: 'natural-marble',
      origin: 'طبيعي معتمد',
      density: '2.70 g/cm³',
      compressiveStrength: '130 MPa',
      waterAbsorption: '0.20%',
      descriptionAr: 'رخام صلب مع عروق طبيعية للأرضيات والمداخل والمدافئ والتحف الفنية الداخلية.',
      imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const createdMaterials: Record<string, any> = {};
  for (const m of materials) {
    createdMaterials[m.slug] = await prisma.material.upsert({
      where: { slug: m.slug },
      update: m,
      create: m,
    });
  }
  console.log(`✅ ${materials.length} Materials seeded.`);

  // 4. Finishes
  const finishes = [
    {
      nameAr: 'بوشارده (نقش خشن آلي / يدوي)',
      nameEn: 'Bush-Hammered Finish',
      slug: 'bush-hammered',
      descriptionAr: 'معالجة سطحية تمنح الحجر ملمساً خشناً منتظماً يبرز صلابة الحجر ويمنع الانزلاق.',
    },
    {
      nameAr: 'مجلي ناعم / صقل رخامي (مطفي أو لامع)',
      nameEn: 'Honed & Polished Finish',
      slug: 'honed-polished',
      descriptionAr: 'صقل فائق ينعم ملمس الحجر ويظهر أدق تفاصيل عروقه الطبيعية وألوانه الغنية.',
    },
    {
      nameAr: 'مسمسم تراثي دقيق',
      nameEn: 'Chiseled Toothed Finish',
      slug: 'chiseled-toothed',
      descriptionAr: 'خطوط طولية دقيقة محفورة يدوياً أو آلياً تعكس الطابع المعماري التراثي الأصيل.',
    },
    {
      nameAr: 'نحت زخرفي بارز وغائر (بمكائن CNC الحديثة)',
      nameEn: 'CNC & Lathe Precision Carved',
      slug: 'bas-relief-carved',
      descriptionAr: 'نحت فني ثلاثي الأبعاد بأحدث مكائن CNC الآلية ومخارط الحجر والرخام الرقمية بدقة هندسية متناهية.',
    },
    {
      nameAr: 'مطبه ومفرغ هندسي',
      nameEn: 'Fluted & Grooved',
      slug: 'fluted-grooved',
      descriptionAr: 'تفريغ هندسي دقيق للأعمدة والمشربيات لإضفاء ظلال بصرية وجمالية معمارية ملفتة.',
    },
  ];

  const createdFinishes: Record<string, any> = {};
  for (const f of finishes) {
    createdFinishes[f.slug] = await prisma.finish.upsert({
      where: { slug: f.slug },
      update: f,
      create: f,
    });
  }
  console.log(`✅ ${finishes.length} Finishes seeded.`);

  // 5. Categories
  const categories = [
    {
      nameAr: 'واجهات حجرية ورخام',
      nameEn: 'Stone & Marble Facades',
      slug: 'facades',
      descriptionAr: 'تصميم وتنفيذ أحدث الواجهات الحجرية للفلل والقصور والمباني الفاخرة بأشكال هندسية راقية.',
      sortOrder: 1,
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    },
    {
      nameAr: 'تيجان وأعمدة وقواعد',
      nameEn: 'Capitals, Columns & Bases',
      slug: 'columns-capitals',
      descriptionAr: 'نحت وتشكيل الأعمدة الرومانية والكورنثية والإسلامية والتيجان والقواعد الحجرية الضخمة.',
      sortOrder: 2,
      imageUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
    },
    {
      nameAr: 'زخارف ونقوش معمارية',
      nameEn: 'Architectural Stone Carvings',
      slug: 'carvings-motifs',
      descriptionAr: 'نقوش حجرية بمكائن CNC وروبوتات النحت ثلاثية الأبعاد والمخارط بدقة وإتقان هندسي لا يضاهى.',
      sortOrder: 3,
      imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    },
    {
      nameAr: 'مشربيات وإطارات شبابيك',
      nameEn: 'Mashrabiyas & Window Frames',
      slug: 'mashrabiyas-frames',
      descriptionAr: 'إطارات شبابيك مقوسة ومشربيات حجرية مفرغة تدمج بين الأصالة والتهوية والخصوصية الجمالية.',
      sortOrder: 4,
      imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    },
    {
      nameAr: 'مداخل وأقواس ملكية',
      nameEn: 'Royal Entrances & Arches',
      slug: 'entrances-arches',
      descriptionAr: 'بوابات ومداخل قصور مقوسة ومطعمة بنقوش حجرية بديعة تمنح المبنى هيبة وفخامة.',
      sortOrder: 5,
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    },
    {
      nameAr: 'شلالات ونوافير وديكورات',
      nameEn: 'Waterfalls, Fountains & Decors',
      slug: 'fountains-decors',
      descriptionAr: 'نوافير حجرية طبيعية وشلالات ومدافئ حجرية فاخرة للحدائق والديكورات الداخلية.',
      sortOrder: 6,
      imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
    },
    {
      nameAr: 'أحجار بناء طبيعية وكسوات',
      nameEn: 'Natural Building Stone & Claddings',
      slug: 'building-stones',
      descriptionAr: 'توريد وقص أحجار البناء اليمنية الطبيعية بمختلف المقاسات والسماكات والتشطيبات.',
      sortOrder: 7,
      imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const createdCategories: Record<string, any> = {};
  for (const c of categories) {
    createdCategories[c.slug] = await prisma.category.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
  }
  console.log(`✅ ${categories.length} Categories seeded.`);

  // 6. Products with Multi-Pricing Modes
  const products = [
    {
      titleAr: 'تاج عمود كورنثي ملكي منحوت بمكائن CNC والمخارط',
      titleEn: 'CNC & Lathe Precision Carved Royal Corinthian Column Capital',
      slug: 'royal-corinthian-capital',
      sku: 'CAP-COR-001',
      shortDescAr: 'تاج عمود حجري فاخر بتفاصيل نباتية دقيقة منحوتة بمكائن CNC المتطورة من حجر بيج مأربي صلب.',
      fullDescAr: 'تاج عمود بتصميم كورنثي ملكي مستوحى من الفنون المعمارية الكلاسيكية، يتميز بزخارف أوراق الأكانثوس البارزة والمحفورة بدقة متناهية. مناسب لمداخل القصور والفلل والمجالس الفاخرة.',
      categorySlug: 'columns-capitals',
      pricingMode: 'STARTING_FROM',
      unit: 'PIECE',
      basePrice: 180000,
      currency: 'YER',
      isFeatured: true,
      materialSlugs: ['maribi-beige-stone', 'white-mountain-stone'],
      finishSlugs: ['bas-relief-carved'],
      imageUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1000&q=80',
    },
    {
      titleAr: 'واجهة قصر ملكية متكاملة - حجر حبش وبيج',
      titleEn: 'Integrated Luxury Palace Stone Facade',
      slug: 'luxury-palace-facade-package',
      sku: 'FAC-PAL-002',
      shortDescAr: 'واجهة متكاملة تجمع بين حجر الحبش الأسود والحجر البيج مع تيجان وأقواس وأحزمة كورنيشية.',
      fullDescAr: 'تصميم وتنفيذ هندسي شامل للواجهات الحجرية الخارجية يشمل الكسوات، الشبابيك المقوسة، التيجان العلوية، والزخارف الهندسية المنحوتة مع إمكانية التعديل حسب المخطط المعماري للمبنى.',
      categorySlug: 'facades',
      pricingMode: 'CUSTOM_QUOTE',
      unit: 'SQUARE_METER',
      basePrice: null,
      currency: 'YER',
      isFeatured: true,
      materialSlugs: ['habash-stone', 'maribi-beige-stone'],
      finishSlugs: ['bush-hammered', 'bas-relief-carved', 'chiseled-toothed'],
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    },
    {
      titleAr: 'حجر بيج مأربي مقاس 30×60 سم سماكة 3 سم (بوشارده)',
      titleEn: 'Maribi Beige Stone Tiles 30x60x3 cm (Bush-Hammered)',
      slug: 'maribi-beige-tiles-30x60',
      sku: 'TIL-BEI-3060',
      shortDescAr: 'أحجار كسوة طبيعية عالية الصلابة ومعالجة بتشطيب بوشارده منتظم للواجهات والجدران.',
      fullDescAr: 'بلاطات حجر طبيعي مقصوصة بدقة ليزرية عالية وسماكة منتظمة 3 سم، معالجة تشطيب بوشارده لمقاومة العوامل الجوية وإعطاء مظهر معماري جذاب ومتناسق.',
      categorySlug: 'building-stones',
      pricingMode: 'PER_SQUARE_METER',
      unit: 'SQUARE_METER',
      basePrice: 16500,
      currency: 'YER',
      isFeatured: true,
      materialSlugs: ['maribi-beige-stone'],
      finishSlugs: ['bush-hammered'],
      imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80',
    },
    {
      titleAr: 'إطار نافذة حجري أندلسي بنقش بارز وقوس علوي',
      titleEn: 'Andalusian Arched Stone Window Frame',
      slug: 'andalusian-arched-window-frame',
      sku: 'WIN-AND-004',
      shortDescAr: 'إطار شباك حجري بنقوش أندلسية وقوس متناسق يمنح الواجهة لمسة تراثية ساحرة.',
      fullDescAr: 'طقم إطار نافذة حجري متكامل يتضمن القاعدة السفلية، الأعمدة الجانبية المنحوتة، والقوس العلوي المزخرف بنقوش نباتية بارزة، مناسب للمقاسات القياسية والمخصصة.',
      categorySlug: 'mashrabiyas-frames',
      pricingMode: 'FIXED_PRICE',
      unit: 'PIECE',
      basePrice: 95000,
      currency: 'YER',
      isFeatured: true,
      materialSlugs: ['maribi-beige-stone', 'white-mountain-stone'],
      finishSlugs: ['bas-relief-carved'],
      imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    },
    {
      titleAr: 'مشربية حجرية مفرغة بنقوش هندسية إسلامية',
      titleEn: 'Perforated Islamic Geometric Stone Mashrabiya',
      slug: 'islamic-geometric-mashrabiya',
      sku: 'MSH-ISL-005',
      shortDescAr: 'مشربية حجرية مفرغة بأشكال هندسية إسلامية توفر الخصوصية وتكسر أشعة الشمس بجمالية فائقة.',
      fullDescAr: 'قطع حجرية مفرغة بدقة هندسية متناهية تُركب في النوافذ والشرفات والواجهات لتوفير الإضاءة الطبيعية والتهوية مع الحفاظ على الخصوصية والمظهر المعماري الإسلامي الرفيع.',
      categorySlug: 'mashrabiyas-frames',
      pricingMode: 'CUSTOM_QUOTE',
      unit: 'SQUARE_METER',
      basePrice: null,
      currency: 'YER',
      isFeatured: false,
      materialSlugs: ['white-mountain-stone', 'maribi-beige-stone'],
      finishSlugs: ['fluted-grooved'],
      imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80',
    },
    {
      titleAr: 'نافورة حجر طبيعي ملكية ثلاثية الطبقات مع حوض دائري',
      titleEn: 'Three-Tier Royal Natural Stone Fountain',
      slug: 'three-tier-royal-stone-fountain',
      sku: 'FOU-ROY-006',
      shortDescAr: 'نافورة حجرية متدرجة ثلاثية الطبقات منحوتة ومخروطة آلياً للحدائق ومداخل القصور والفلل.',
      fullDescAr: 'تحفة فنية حجرية متكاملة تتضمن حوضاً دائرياً بنقوش بارزة وثلاث طبقات مائية تفيض بانسيابية ساحرة، مجهزة بفتحات التمديدات المائية والكهربائية.',
      categorySlug: 'fountains-decors',
      pricingMode: 'STARTING_FROM',
      unit: 'SET',
      basePrice: 650000,
      currency: 'YER',
      isFeatured: true,
      materialSlugs: ['maribi-beige-stone', 'natural-marble'],
      finishSlugs: ['bas-relief-carved', 'honed-polished'],
      imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80',
    },
    {
      titleAr: 'حجر حبش أسود صنعاني مقاس 25×50 سم (مسمسم دقيق)',
      titleEn: 'Black Habash Sanaani Tiles 25x50 cm (Chiseled)',
      slug: 'black-habash-tiles-25x50',
      sku: 'TIL-HAB-2550',
      shortDescAr: 'حجر حبش أسود بركاني بتشطيب مسمسم دقيق للمداخل والواجهات الحديثة والكلاسيكية.',
      fullDescAr: 'حجر حبش طبيعي أسود فاحم يتميز بصلابة استثنائية ونقش مسمسم متقن، يمنح الجدران والواجهات فخامة داكنة وتناغماً رائعاً عند دمجه مع الحجر البيج.',
      categorySlug: 'building-stones',
      pricingMode: 'PER_SQUARE_METER',
      unit: 'SQUARE_METER',
      basePrice: 19000,
      currency: 'YER',
      isFeatured: false,
      materialSlugs: ['habash-stone'],
      finishSlugs: ['chiseled-toothed'],
      imageUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1000&q=80',
    },
    {
      titleAr: 'مدخل قصر مقوس مع أعمدة مزدوجة ونقوش بارزة',
      titleEn: 'Grand Palace Arched Entrance with Twin Columns',
      slug: 'grand-palace-arched-entrance',
      sku: 'ENT-PAL-008',
      shortDescAr: 'بوابة مدخل رئيسي متكاملة بأقواس حجرية وأعمدة رومانية وتيجان منحوتة.',
      fullDescAr: 'تصميم وتنفيذ متكامل لمداخل الفلل والقصور يضم عمودين مزدوجين وقوساً علوياً ضخماً مزيناً بزخارف هندسية ونباتية ثلاثية الأبعاد تعكس الهيبة المعمارية.',
      categorySlug: 'entrances-arches',
      pricingMode: 'CUSTOM_QUOTE',
      unit: 'PROJECT',
      basePrice: null,
      currency: 'YER',
      isFeatured: true,
      materialSlugs: ['habash-stone', 'maribi-beige-stone', 'white-mountain-stone'],
      finishSlugs: ['bas-relief-carved'],
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
    },
  ];

  for (const p of products) {
    const category = createdCategories[p.categorySlug];
    if (!category) continue;

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        titleAr: p.titleAr,
        titleEn: p.titleEn,
        sku: p.sku,
        shortDescAr: p.shortDescAr,
        fullDescAr: p.fullDescAr,
        pricingMode: p.pricingMode,
        unit: p.unit,
        basePrice: p.basePrice,
        currency: p.currency,
        isFeatured: p.isFeatured,
        categoryId: category.id,
      },
      create: {
        titleAr: p.titleAr,
        titleEn: p.titleEn,
        slug: p.slug,
        sku: p.sku,
        shortDescAr: p.shortDescAr,
        fullDescAr: p.fullDescAr,
        pricingMode: p.pricingMode,
        unit: p.unit,
        basePrice: p.basePrice,
        currency: p.currency,
        isFeatured: p.isFeatured,
        categoryId: category.id,
      },
    });

    // Add Image
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: p.imageUrl,
        altTextAr: p.titleAr,
        isFeatured: true,
        sortOrder: 0,
      },
    });

    // Add Material & Finish relations
    await prisma.productMaterial.deleteMany({ where: { productId: product.id } });
    for (const matSlug of p.materialSlugs) {
      const mat = createdMaterials[matSlug];
      if (mat) {
        await prisma.productMaterial.create({
          data: {
            productId: product.id,
            materialId: mat.id,
          },
        });
      }
    }

    await prisma.productFinish.deleteMany({ where: { productId: product.id } });
    for (const finSlug of p.finishSlugs) {
      const fin = createdFinishes[finSlug];
      if (fin) {
        await prisma.productFinish.create({
          data: {
            productId: product.id,
            finishId: fin.id,
          },
        });
      }
    }
  }
  console.log(`✅ ${products.length} Products seeded with materials & finishes.`);

  // 7. Architectural Projects Portfolio (Our Work)
  const projectCategory = await prisma.projectCategory.upsert({
    where: { slug: 'luxury-villas' },
    update: { nameAr: 'واجهات فلل وقصور', nameEn: 'Villas & Palaces Facades' },
    create: { nameAr: 'واجهات فلل وقصور', nameEn: 'Villas & Palaces Facades', slug: 'luxury-villas' },
  });

  const projects = [
    {
      titleAr: 'مشروع واجهة قصر فخامة الحجر - حده، صنعاء',
      titleEn: 'Luxury Stone Palace Facade Project - Haddah, Sanaa',
      slug: 'palace-facade-haddah-sanaa',
      projectType: 'PALACE_FACADE',
      locationCity: 'حده، صنعاء، اليمن',
      completionYear: 2025,
      shortDescAr: 'تنفيذ واجهات حجرية ضخمة تجمع بين حجر الحبش الأسود والحجر البيج مع تيجان كورنثية وأقواس ملكية.',
      fullDescAr: 'تم تنفيذ هذا الصرح المعماري باستخدام أجود أنواع الحجر الصنعاني الطبيعي بتشطيب بوشارده ومسمسم، مع نحت أكثر من 16 تاج عمود كورنثي و24 إطار نافذة مقوس بزخارف بارزة ثلاثية الأبعاد.',
      coverImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      isFeatured: true,
      categoryId: projectCategory.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', imageType: 'MAIN', captionAr: 'الواجهة الرئيسية للقصر' },
        { url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80', imageType: 'DETAIL', captionAr: 'تفاصيل نحت التيجان والأعمدة' },
        { url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80', imageType: 'DETAIL', captionAr: 'إطارات النوافذ والأقواس الحجرية' },
      ],
    },
    {
      titleAr: 'مشروع المداخل والأعمدة الملكية - فج عطان',
      titleEn: 'Royal Entrances & Columns Project - Faj Attan',
      slug: 'royal-entrances-faj-attan',
      projectType: 'ROYAL_ENTRANCE',
      locationCity: 'فج عطان، صنعاء، اليمن',
      completionYear: 2025,
      shortDescAr: 'نحت وتركيب بوابات حجرية شاهقة وأعمدة رومانية مجوفة ومفرغة بدقة هندسية عالية.',
      fullDescAr: 'تم تصميم ونحت مدخل رئيسي بارتفاع 7 أمتار يتضمن 4 أعمدة رئيسية متدرجة وتيجاناً منحوتة بمكائن CNC ومخارط الأعمدة مع حزام كورنيشي مزخرف بنقوش هندسية دقيقة.',
      coverImageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      isFeatured: true,
      categoryId: projectCategory.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', imageType: 'MAIN', captionAr: 'المدخل الملكي المتكامل' },
        { url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80', imageType: 'DETAIL', captionAr: 'نقوش القوس الرئيسي' },
      ],
    },
    {
      titleAr: 'مشروع فيلا الواجهات الحجرية المعاصرة - صنعاء',
      titleEn: 'Contemporary Stone Villa Facade Project - Sanaa',
      slug: 'contemporary-stone-villa-sanaa',
      projectType: 'VILLA_FACADE',
      locationCity: 'صنعاء، اليمن',
      completionYear: 2024,
      shortDescAr: 'دمج عصري بين الحجر البيج والأحزمة الحجرية السوداء مع مشربيات حجرية مفرغة.',
      fullDescAr: 'واجهة فيلا حديثة تميزت بتناغم لوني فريد بين الحجر البيج الطبيعي وحجر الحبش الأسود، مع تنفيذ مشربيات حجرية هندسية تكسر حدة الشمس وتوفر خصوصية تامة.',
      coverImageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      isFeatured: true,
      categoryId: projectCategory.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80', imageType: 'MAIN', captionAr: 'واجهة الفيلا المتكاملة' },
        { url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80', imageType: 'AFTER', captionAr: 'الشلال الحجري في الحديقة الداخلية' },
      ],
    },
  ];

  for (const prj of projects) {
    const project = await prisma.project.upsert({
      where: { slug: prj.slug },
      update: {
        titleAr: prj.titleAr,
        titleEn: prj.titleEn,
        projectType: prj.projectType,
        locationCity: prj.locationCity,
        completionYear: prj.completionYear,
        shortDescAr: prj.shortDescAr,
        fullDescAr: prj.fullDescAr,
        coverImageUrl: prj.coverImageUrl,
        isFeatured: prj.isFeatured,
        categoryId: prj.categoryId,
      },
      create: {
        titleAr: prj.titleAr,
        titleEn: prj.titleEn,
        slug: prj.slug,
        projectType: prj.projectType,
        locationCity: prj.locationCity,
        completionYear: prj.completionYear,
        shortDescAr: prj.shortDescAr,
        fullDescAr: prj.fullDescAr,
        coverImageUrl: prj.coverImageUrl,
        isFeatured: prj.isFeatured,
        categoryId: prj.categoryId,
      },
    });

    await prisma.projectImage.deleteMany({ where: { projectId: project.id } });
    for (let i = 0; i < prj.images.length; i++) {
      const img = prj.images[i];
      await prisma.projectImage.create({
        data: {
          projectId: project.id,
          url: img.url,
          imageType: img.imageType,
          captionAr: img.captionAr,
          sortOrder: i,
        },
      });
    }
  }
  console.log(`✅ ${projects.length} Architectural Projects seeded with galleries.`);

  // 8. Demo Quotation (RFQ)
  const sampleRfq = await prisma.quotation.upsert({
    where: { referenceNumber: 'RFQ-2026-0001' },
    update: {},
    create: {
      referenceNumber: 'RFQ-2026-0001',
      customerName: 'الشيخ عبد الله الأحمدي',
      phone: '+967771234567',
      whatsapp: '+967771234567',
      city: 'صنعاء - بيت بوس',
      projectType: 'VILLA_FACADE',
      preferredStoneType: 'حجر بيج مأربي + حجر حبش صنعاني',
      approximateBudget: 'حسب المواصفات المعتمدة',
      description: 'نود طلب تسعير وتنفيذ واجهة فيلا دورين بمساحة تقريبية 380 متر مربع، مع 8 شبابيك مقوسة وتيجان أعمدة للمدخل الرئيسي وفق المخطط المرفق.',
      needsInstallation: true,
      needsDelivery: true,
      status: 'PRICED',
      totalQuotedPrice: 4850000,
      currency: 'YER',
      adminNotes: 'تم إعداد جدول الكميات والتسعير بناء على المخطط المعماري المرفق، يشمل التوريد والقص والنحت والتركيب بواسطة معلمين مختصين.',
      items: {
        create: [
          {
            customTitle: 'حجر كسوة بيج مأربي مقاس 30×60 سم بوشارده',
            quantity: 380,
            unit: 'SQUARE_METER',
            unitPriceEstimate: 16500,
            totalPriceEstimate: 627000,
            dimensionsDesc: 'مساحة الواجهات الصافية 380 م²',
          },
          {
            customTitle: 'أطقم تيجان وأعمدة حجرية منحوتة للمدخل الرئيسي',
            quantity: 4,
            unit: 'PIECE',
            unitPriceEstimate: 180000,
            totalPriceEstimate: 720000,
            dimensionsDesc: 'ارتفاع 3.5 متر مع القواعد والتيجان',
          },
        ],
      },
      statusHistory: {
        create: [
          { previousStatus: null, newStatus: 'NEW', notes: 'تم استلام طلب السعر من الموقع الإلكتروني' },
          { previousStatus: 'NEW', newStatus: 'UNDER_REVIEW', notes: 'قيد الدراسة الهندسية من قسم التسعير' },
          { previousStatus: 'UNDER_REVIEW', newStatus: 'PRICED', notes: 'تم اعتماد جدول الكميات وإصدار عرض السعر' },
        ],
      },
    },
  });
  console.log(`✅ Demo RFQ seeded: ${sampleRfq.referenceNumber}`);

  console.log('🎉 Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
