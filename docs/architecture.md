# System Architecture — المعمارية التقنية للمنصة

## 1. Overview
منصة **«الوحيد للزخرفة المعمارية والنحت والمقاولات العامة»** مبنية وفق نمط **Modular Monolith** مع الالتزام بمبادئ **Clean Architecture** و **Domain-Driven Design (DDD) الخفيف**.

المشروع منظم كـ **Monorepo** باستخدام **pnpm workspaces** و **Turborepo** لتحقيق أعلى كفاءة في البناء، والتكامل، ومشاركة الأنواع والتحققات.

---

## 2. High-Level Architecture Diagram

```mermaid
graph TD
    subgraph Clients ["طبقة الواجهات والمستخدمين"]
        Visitor["الزائر / العميل المعماري"]
        AdminUser["مدير النظام / مسؤول المبيعات"]
    end

    subgraph Applications ["تطبيقات المنظومة (Apps)"]
        Storefront["apps/storefront (Next.js 14 App Router)<br/>• RTL / Arabic First<br/>• Architectural Portfolio<br/>• Multi-Pricing Catalog<br/>• Interactive RFQ Engine<br/>• Direct Cart & Checkout"]
        AdminApp["apps/admin (Next.js / Modern Admin)<br/>• Catalog & Inventory<br/>• RFQ State Machine Manager<br/>• Portfolio & Before/After<br/>• Media Library<br/>• Dynamic CMS & Settings<br/>• RBAC & Audit Trails"]
        APIServer["apps/api (NestJS / Fastify Modular Core)<br/>• Layered Architecture<br/>• Domain & Application Use Cases<br/>• DTOs & Zod Validation<br/>• RBAC Guards & Audit Logger"]
    end

    subgraph SharedPackages ["الحزم المشتركة (Packages)"]
        PkgTypes["packages/types (Domain Models & Enums)"]
        PkgValidation["packages/validation (Shared Zod Schemas)"]
        PkgUI["packages/ui (Design System & Tokens)"]
        PkgConfig["packages/config (TSConfig / ESLint)"]
    end

    subgraph InfrastructureServices ["البنية التحتية والبيانات"]
        PostgresDB[("PostgreSQL Database<br/>Prisma ORM")]
        RedisCache[("Redis (Caching & Rate Limits)")]
        Storage["Storage Abstraction<br/>(Local / S3 / Cloudinary)"]
    end

    Visitor -->|HTTPS / Browsing & RFQ| Storefront
    AdminUser -->|HTTPS / Secure RBAC| AdminApp
    Storefront -->|REST API v1| APIServer
    AdminApp -->|REST API v1| APIServer

    Storefront -.-> PkgTypes
    Storefront -.-> PkgValidation
    Storefront -.-> PkgUI

    AdminApp -.-> PkgTypes
    AdminApp -.-> PkgValidation
    AdminApp -.-> PkgUI

    APIServer -.-> PkgTypes
    APIServer -.-> PkgValidation

    APIServer --> PostgresDB
    APIServer --> RedisCache
    APIServer --> Storage
```

---

## 3. Core Modules & Domain Boundaries

النظام مقسم إلى موديولات مستقلة ذات حدود واضحة (Bounded Contexts):

1. **Catalog Module (`modules/catalog`):**
   - إدارة المنتجات الحجرية، الفئات، المواد (حبش، رخام، حجر بيج...)، التشطيبات (بوشارده، مجلي، مسمسم، مطبه...)، الألوان، والمقاسات.
   - يدعم أنماط التسعير المتعددة (`ProductPricingMode`).

2. **Quotations & RFQ Module (`modules/quotations`):**
   - إدارة طلبات عروض الأسعار والتصاميم المخصصة.
   - محرك الحالات (State Machine) لضبط مسار الطلب: `NEW` ➔ `UNDER_REVIEW` ➔ `PRICED` ➔ `SENT` ➔ `ACCEPTED` ➔ `CONVERTED_TO_ORDER`.
   - إرفاق المخططات الهندسية والصور مع حماية الملفات.

3. **Portfolio & Projects Module (`modules/projects`):**
   - إدارة سابقة الأعمال والمشاريع المنفذة (واجهات، فلل، قصور، مداخل، تيجان، نوافير).
   - دعم صور المقارنة (Before / After)، ربط المواد المستخدمة والخدمات المنفذة.

4. **Orders & Commerce Module (`modules/orders`):**
   - إدارة الطلبات المباشرة، عربة التسوق، الفواتير، وحالات الدفع والتجهيز.
   - طبقة تجريد بوابات الدفع (`PaymentProvider`).

5. **Media Asset Module (`modules/media`):**
   - مكتبة وسائط مركزية مع تجريد التخزين (`FileStorageProvider`).
   - تحسين الصور (WebP/AVIF)، توليد الصور المصغرة، والتحقق الصارم من الـ MIME.

6. **Content & Settings Module (`modules/content`, `modules/settings`):**
   - إدارة محتوى الصفحة الرئيسية (Hero, Banners, Trust Factors, Services, FAQs).
   - إدارة الإعدادات العامة المتغيرة (أرقام التواصل، WhatsApp، ساعات العمل، العملة، الروابط).

7. **Auth & RBAC Module (`modules/auth`, `modules/users`):**
   - مصادقة آمنة عبر JWT مع HttpOnly Cookies.
   - تحكم صارم بالصلاحيات على مستوى الـ Backend: `SUPER_ADMIN`, `ADMIN`, `CATALOG_MANAGER`, `SALES_MANAGER`, `CONTENT_MANAGER`.

8. **Audit & Analytics Module (`modules/audit`, `modules/analytics`):**
   - سجل تدقيق غير قابل للتعديل (`AuditLog`) للعمليات الحساسة.
   - تتبع تحليلي للأحداث المعمارية والتجارية دون انتهاك خصوصية الزائر.
