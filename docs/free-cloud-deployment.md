# دليل الاستضافة السحابية المجانية 100% (Free Cloud Hosting Guide)

هذا الدليل يشرح أفضل وأسهل طريقة لاستضافة منصة **«الوحيد للزخرفة المعمارية والنحت»** على السحابة مجاناً بالكامل دون دفع أي رسوم.

---

## 🏗️ الخطة الموصى بها (أفضل أداء واستقرار مجاني)

| المكون | المنصة المجانية | المميزات |
| :--- | :--- | :--- |
| **قاعدة البيانات (PostgreSQL)** | **[Neon.tech](https://neon.tech)** أو **[Supabase](https://supabase.com)** | قاعدة بيانات سحابية مجانية، وسريعة، ونسخ احتياطي تلقائي |
| **الخادم الخلفي (API)** | **[Render.com](https://render.com)** أو **[Koyeb.com](https://koyeb.com)** | استضافة مجانية لخدمة Node.js مع SSL تلقائي |
| **المتجر ولوحة الإدارة (Next.js)** | **[Vercel.com](https://vercel.com)** | أسرع وأفضل استضافة لـ Next.js عالمياً مجاناً مع CDN عالمي |

---

## 🚀 خطوات النشر خطوة بخطوة

### الخطوة 1: رفع المشروع إلى GitHub
1. أنشئ مستودعاً جديداً (Repository) على حسابك في GitHub (عام أو خاص).
2. ارفع مجلد المشروع إليه عبر الأوامر:
```bash
git init
git add .
git commit -m "feat: complete al-waheed enterprise platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/al-waheed-store.git
git push -u origin main
```

---

### الخطوة 2: إنشاء قاعدة بيانات PostgreSQL مجانية (Neon.tech)
1. سجل دخول في [Neon.tech](https://neon.tech) مجاناً.
2. أنشئ مشروعاً جديداً باسم `alwaheed-db`.
3. انسخ رابط الاتصال `DATABASE_URL` (مثال: `postgresql://user:pass@ep-cool-cloud.neon.tech/neondb?sslmode=require`).

---

### الخطوة 3: نشر الخادم الخلفي (Render.com)
1. سجل دخول في [Render.com](https://render.com).
2. اضغط **New +** ثم اختر **Web Service**.
3. اربط مستودع GitHub الخاص بك.
4. اضبط الإعدادات التالية:
   - **Root Directory:** اتركه فارغاً.
   - **Environment:** `Node`
   - **Build Command:** `pnpm install && pnpm --filter @al-waheed/types build && pnpm --filter @al-waheed/validation build && pnpm --filter @al-waheed/api build && pnpm --filter @al-waheed/api db:push && pnpm --filter @al-waheed/api db:seed`
   - **Start Command:** `pnpm --filter @al-waheed/api start`
   - **Plan:** `Free`
5. أضف المتغيرات البيئية (**Environment Variables**):
   - `DATABASE_URL` = (رابط Neon من الخطوة 2)
   - `JWT_SECRET` = (أي نص سري مثل `AlWaheedSecret2026!`)
   - `NODE_ENV` = `production`
6. اضغط **Deploy**. ستحصل على رابط للـ API مثل: `https://alwaheed-api.onrender.com`.

---

### الخطوة 4: نشر المتجر (Vercel.com - Storefront)
1. سجل دخول في [Vercel.com](https://vercel.com).
2. اضغط **Add New Project** واختر مستودع GitHub.
3. اضبط الإعدادات:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** اضغط Edit واختر `apps/storefront`.
4. في **Environment Variables** أضف:
   - `NEXT_PUBLIC_API_URL` = `https://alwaheed-api.onrender.com/api/v1` (رابط API من الخطوة 3).
5. اضغط **Deploy**. ستحصل على رابط الموقع مثل: `https://alwaheed-store.vercel.app`.

---

### الخطوة 5: نشر لوحة التحكم (Vercel.com - Admin)
1. في Vercel، اضغط مجدداً **Add New Project** لنفس المستودع.
2. اضبط الإعدادات:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** اختر `apps/admin`.
3. في **Environment Variables** أضف:
   - `NEXT_PUBLIC_API_URL` = `https://alwaheed-api.onrender.com/api/v1`
4. اضغط **Deploy**. ستحصل على رابط لوحة الإدارة مثل: `https://alwaheed-admin.vercel.app`.

---

## 🎯 النتيجة النهائية
ستحصل على روابط عامة حقيقية ومؤمنة بـ HTTPS مجاناً 100%:
- 🌐 **رابط المتجر:** `https://your-store.vercel.app`
- ⚙️ **رابط الإدارة:** `https://your-admin.vercel.app`
- 🔌 **رابط الـ API:** `https://your-api.onrender.com`
