# مؤسسة الوحيد للزخرفة المعمارية ونحت والمقاولات العامة
## Al-Waheed Platform for Architectural Ornamentation, Stone Carving & General Contracting

---

## 1. نبذة عن المنصة (Overview)
منصة تجارية ومعمارية متكاملة فائقة الفخامة وقابلة للتوسع مبنية وفق نمط **Modular Monolith** مع معمارية نظيفة **Clean Architecture** و **Feature-Based Architecture**.

تجمع المنصة بين:
1. **واجهة متجر ومعرض معماري فاخر (Storefront & Portfolio):** بتقنيات Next.js 14 App Router وتصميم RTL عربي مخصص يعكس هيبة الحجر الطبيعي والرخام.
2. **محرك عروض الأسعار والتصاميم الخاصة (Interactive RFQ Engine):** لإتاحة رفع المخططات الهندسية وتحديد القياسات ونوع الحجر وجدول الكميات.
3. **نظام تسعير متعدد الأنماط (Multi-Pricing Modes):** يدعم السعر بالقطعة، بالمتر المربع (m²)، بالمتر الطولي، السعر التقديري (يبدأ من)، والتسعير حسب الطلب.
4. **لوحة تحكم إدارية شاملة (Admin Dashboard):** لإدارة الكتالوج، المشاريع، محرك حالات عروض الأسعار (Quotation State Machine)، الطلبات، الوسائط، الإعدادات، والصلاحيات (RBAC).
5. **نواة خلفية قوية (Backend Core API):** مبنية بـ Node.js / Express / TypeScript مع Prisma ORM، وتدعم PostgreSQL و SQLite.

---

## 2. البيانات التجارية المعتمدة والمحققة (Verified Enterprise Info)

- **الاسم التجاري:** مؤسسة الوحيد للزخرفة المعمارية ونحت والمقاولات العامة
- **الموقع الجغرافي:** حده - فج عطان، صنعاء، الجمهورية اليمنية
- **رقم الهاتف المباشر:** `+967 770663641` (770663641)
- **رقم الواتساب الرسمي:** `+967 770663641`
- **التخصصات:** نحت وزخرفة الأحجار الطبيعية (حبش، بيج، أبيض، سيلاني)، واجهات الفلل والقصور، تيجان وأعمدة وقواعد رومانية، مشربيات وإطارات شبابيك، شلالات ونوافير، ومقاولات حجرية متكاملة.

---

## 3. الهيكل المعماري للمشروع (Monorepo Directory Tree)

```text
al-waheed-platform/
│
├── apps/
│   ├── storefront/             # واجهة المتجر والمعرض وطلب عروض الأسعار (Next.js 14)
│   ├── admin/                  # لوحة التحكم والإدارة الشاملة (Next.js 14)
│   └── api/                    # خادم الـ REST API وقاعدة البيانات (Node / Prisma)
│
├── packages/
│   ├── types/                  # الأنواع والنماذج ومصفوفات الحالات المشتركة
│   ├── validation/             # مخططات التحقق المشتركة (Zod Schemas)
│   ├── ui/                     # Design System ومحددات الألوان ومساعدات التنسيق
│   └── config/                 # إعدادات الـ TypeScript والـ ESLint
│
├── infrastructure/
│   ├── docker/                 # ملفات الـ Dockerfile و Nginx
│   └── docker-compose.yml      # بيئة التشغيل السحابية والحاويات
│
├── docs/                       # التوثيق المعماري والهندسي الشامل
│   ├── architecture.md
│   ├── database.md
│   ├── business-rules.md
│   ├── business-source-audit.md
│   ├── api.md
│   ├── security.md
│   ├── deployment.md
│   └── development-guide.md
│
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
└── README.md
```

---

## 4. تعليمات التشغيل السريع (Quick Start)

### 1. تثبيت الحزم:
```bash
pnpm install
```

### 2. تهيئة قاعدة البيانات والتغذية الأولية (Database & Seed):
```bash
pnpm db:generate
pnpm db:push
pnpm db:seed
```

### 3. تشغيل كافة الخدمات محلياً (Start Dev):
```bash
pnpm dev
```

- **المتجر والمعرض (Storefront):** `http://localhost:3000`
- **لوحة الإدارة (Admin Portal):** `http://localhost:3001`
- **نواة الـ Backend API:** `http://localhost:4000/api/v1`
- **فحص صحة الخادم (Health Check):** `http://localhost:4000/health`

---

## 5. الحساب الإداري الافتراضي (Default Super Admin)

- **البريد الإلكتروني:** `admin@alwaheed-stone.com`
- **كلمة المرور الافتراضية:** `Admin@AlWaheed2026!`
*(يمكن تخصيص كلمة المرور عبر متغير `INITIAL_ADMIN_PASSWORD` في ملف `.env`)*

---

## 6. التشغيل عبر Docker Compose

```bash
docker compose up -d --build
```
يتم تشغيل حاويات: PostgreSQL 16, Redis 7, Backend API, Storefront, Admin Portal.
