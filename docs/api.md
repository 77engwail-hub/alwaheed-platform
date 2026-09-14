# API Specifications — وثيقة واجهات البرمجة (REST API v1)

تتبع جميع واجهات البرمجة مسار الإصدار الأول الموحد: `/api/v1/` وتستخدم استجابات JSON موحدة مع معالجة استثناءات مركزية ورموز استجابة HTTP قياسية.

---

## 1. Response Structure

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 142,
    "totalPages": 8
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "بيانات غير صالحة، يرجى مراجعة الحقول المطلوبة",
    "details": [
      { "field": "phone", "issue": "رقم الهاتف غير متطابق مع الصيغة المعتمدة" }
    ],
    "timestamp": "2026-09-15T00:24:00.000Z"
  }
}
```

---

## 2. Main API Endpoints Matrix

### A. Catalog & Materials
- `GET /api/v1/products` — استرجاع قائمة المنتجات مع الفلاتر والبحث والترتيب.
- `GET /api/v1/products/:slug` — تفاصيل منتج محدد مع متغيراته وتشطيباته والمشروعات المرتبطة.
- `GET /api/v1/categories` — تصنيفات المنتجات وأقسام الكتالوج.
- `GET /api/v1/materials` — أنواع الحجر الطبيعي والرخام والجرانيت.
- `GET /api/v1/finishes` — أنواع المعالجات السطحية (بوشارده، مجلي، مسمسم، مطبه...).

### B. Portfolio & Projects
- `GET /api/v1/projects` — سابقة الأعمال والمشاريع المنفذة مع الفلاتر (واجهات، قصور، مداخل...).
- `GET /api/v1/projects/:slug` — تفاصيل المشروع، صور Before/After، والمواد المستخدمة.
- `GET /api/v1/project-categories` — تصنيفات المشاريع.

### C. Quotation & RFQ Engine
- `POST /api/v1/quotations` — إنشاء طلب عرض سعر أو تصميم خاص (مع دعم رفع المخططات).
- `GET /api/v1/quotations/:referenceNumber` — تتبع حالة طلب السعر برقم المعاملة.
- `POST /api/v1/quotations/:id/messages` — إرسال رسالة أو استفسار توضيحي من العميل.

### D. Orders & Checkout
- `POST /api/v1/orders` — إنشاء طلب شراء مباشر للبنود ذات السعر الثابت.
- `GET /api/v1/orders/:orderNumber` — تتبع حالة الطلب وتفاصيل الشحنة.

### E. CMS, Contact & Settings
- `GET /api/v1/content/homepage` — بيانات الصفحة الرئيسية الديناميكية (Hero, Banners, Trust).
- `GET /api/v1/settings` — إعدادات المؤسسة العامة (أرقام التواصل، واتساب، ساعات العمل، العملة).
- `POST /api/v1/contact` — إرسال استفسار عام.

### F. Administration (Protected by RBAC Guards)
- `POST /api/v1/admin/auth/login` — تسجيل دخول لوحة التحكم وتوليد JWT الآمن.
- `GET /api/v1/admin/dashboard/stats` — إحصائيات لوحة التحكم ومؤشرات الأداء.
- `GET /api/v1/admin/quotations` — استعراض كافة طلبات الأسعار والفلترة بحسب الحالة.
- `PATCH /api/v1/admin/quotations/:id/status` — تنفيذ انتقال حالة معتمد للـ RFQ.
- `PUT /api/v1/admin/quotations/:id/pricing` — إدخال جدول الأسعار وشروط التوريد للعرض.
- `POST /api/v1/admin/quotations/:id/convert-to-order` — تحويل العرض إلى أمر تنفيذ ومشروع.
- `POST /api/v1/admin/products` — إضافة منتج حجري جديد مع صوره ومتغيراته.
- `PUT /api/v1/admin/products/:id` — تعديل بيانات المنتج ونمط التسعير.
- `DELETE /api/v1/admin/products/:id` — حذف ناعم (Soft Delete) للمنتج.
- `POST /api/v1/admin/projects` — إضافة مشروع وسابقة أعمال مع معرض الصور.
- `POST /api/v1/admin/media/upload` — رفع ملفات وسائط متعددة مع فحص الـ MIME.
- `PUT /api/v1/admin/settings` — تعديل إعدادات المؤسسة وأرقام التواصل.
- `GET /api/v1/admin/audit-logs` — استعراض سجل التدقيق للعمليات الإدارية.
