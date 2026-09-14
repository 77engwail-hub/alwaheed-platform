# Security Architecture & Safeguards — معايير الأمان والحماية

## 1. Authentication & Session Security
- **تشفير كلمات المرور:** استخدام خوارزمية `bcrypt` مع معيار Salt Rounds مرتفع.
- **إدارة الـ Tokens:** توليد JSON Web Tokens (JWT) مشفرة وموقعة بمفتاح سري آمن مع زمن صلاحية قصير للـ Access Token و Refresh Token مخزن في `HttpOnly`, `SameSite=Strict`, `Secure` Cookies لمنع هجمات XSS.
- **الحماية من هجمات التخمين (Brute-Force Protection):** تتبع محاولات تسجيل الدخول الفاشلة وتطبيق Rate Limiting على مسارات المصادقة.

---

## 2. Role-Based Access Control (RBAC)
- لا يعتمد النظام على إخفاء الأزرار في الواجهة فحسب، بل يفرض التحقق الصارم في الـ API عبر `Guards` و `Permissions`:
  - `SUPER_ADMIN`: صلاحيات كاملة تشمل إدارة المستخدمين وإعدادات النظام الحساسة.
  - `ADMIN`: إدارة العمليات التشغيلية، الكتالوج، والمشاريع.
  - `CATALOG_MANAGER`: إضافة وتعديل المنتجات والمواد والتشطيبات والوسائط.
  - `SALES_MANAGER`: إدارة طلبات عروض الأسعار، إدخال الأسعار، ومتابعة الطلبات.
  - `CONTENT_MANAGER`: إدارة محتوى الصفحة الرئيسية، المعارض، والبانرات.

---

## 3. Data Protection & Input Sanitization
- **منع حقن الاستعلامات (SQL Injection):** استخدام Prisma ORM مع استعلامات معلّمة (Parameterized Queries).
- **التحقق الشامل من المدخلات (Strict DTO Validation):** فحص جميع المدخلات عبر مكتبة `Zod` في الواجهة والخلفية مع رفض أي حقول غير مصرح بها.
- **منع هجمات الـ XSS:** تعقيم وتطهير جميع المخرجات النصية وعدم تنفيذ أكواد HTML خام.
- **حماية الـ CSRF:** تفعيل تدابير التحقق من الترويسات وحماية الطلبات عبر الـ SameSite Cookie Policies.

---

## 4. File Upload Security
- تجريد التخزين عبر `StorageProvider`.
- التحقق الصارم من نوع الملف الفعلي (Magic Numbers / MIME Type inspection) وليس فقط الامتداد الظاهري.
- حصر الامتدادات المسموح بها للمخططات والصور: `.jpg`, `.jpeg`, `.png`, `.webp`, `.pdf`.
- وضع حد أقصى لحجم الملف المرفوع (مثلاً 15MB للـ PDF و 10MB للصور).
- توليد أسماء عشوائية فريدة وآمنة للملفات المرفوعة لمنع هجمات الـ Path Traversal والكتابة فوق الملفات.

---

## 5. Security Headers & Network Hygiene
- تطبيق ترويسات الأمان عبر `Helmet`:
  - `Content-Security-Policy`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- عزل مفاتيح البيئة والبيانات الحساسة في ملفات `.env` مع توفير `.env.example` نظيف وخالٍ من الأسرار.
