# Development & Contribution Guide — دليل التطوير والتشغيل المحلي

## 1. المتطلبات الأساسية (Prerequisites)
- **Node.js**: الإصدار 18 أو 20 أو 22+ (المثبت: Node v24 LTS).
- **Package Manager**: `pnpm` (المثبت: v11.x) أو `npm` v11.
- **Docker & Docker Compose**: للتشغيل الحاوي وقاعدة البيانات.

---

## 2. خطوات الإعداد والتشغيل المحلي السريع (Quick Start)

### الخطوة 1: تثبيت الحزم (Install Dependencies)
```bash
pnpm install
```

### الخطوة 2: تهيئة ملف البيئة (Environment Setup)
```bash
cp .env.example .env
```

### الخطوة 3: تشغيل قاعدة البيانات وتطبيق التهجيرات (DB Migration & Seed)
```bash
pnpm db:generate
pnpm db:push
pnpm db:seed
```

### الخطوة 4: تشغيل خوادم التطوير (Start Dev Servers)
```bash
pnpm dev
```

- **واجهة المتجر والمعرض المعماري (Storefront):** `http://localhost:3000`
- **لوحة التحكم الإدارية (Admin Portal):** `http://localhost:3001`
- **نواة الـ Backend API:** `http://localhost:4000/api/v1`
- **وثائق الـ Swagger API:** `http://localhost:4000/api/docs`

---

## 3. أوامر الاختبار والتحقق من الجودة (Lint & Test)

```bash
# فحص الأنواع (Type Checking)
pnpm typecheck

# فحص المعايير البرمجية (ESLint)
pnpm lint

# تشغيل الاختبارات الأحادية والتكاملية (Unit & Integration Tests)
pnpm test

# بناء كافة التطبيقات للإنتاج (Production Build)
pnpm build
```

---

## 4. الحساب الإداري الافتراضي الآمن (Default Admin Initialization)

عند تنفيذ أمر الـ Seed لأول مرة:
- يتم إنشاء مستخدم إداري بدور `SUPER_ADMIN`.
- يتم توليد كلمة مرور أولية عشوائية وطباعتها في الطرفية لمرة واحدة أو قراءتها من متغير `INITIAL_ADMIN_PASSWORD` في ملف `.env`، ويفرض النظام تغيير كلمة المرور عند أول تسجيل دخول لضمان الأمان التام.
