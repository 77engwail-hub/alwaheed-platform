# Deployment & DevOps Guide — دليل النشر والتشغيل السحابي

## 1. Containerization & Docker Setup

المشروع مهيأ بالكامل للتشغيل عبر **Docker** و **Docker Compose** لبيئتي التطوير المحلي والإنتاج.

### مكونات البيئة المدمجة (`docker-compose.yml`):
- `postgres`: خادم قاعدة بيانات PostgreSQL 16 مع إعدادات حفظ البيانات الدائمة (Persistent Volumes).
- `redis`: خادم ذاكرة وسيطة للكاش وتحديد معدل الطلبات (Rate Limiting).
- `api`: خادم الـ Backend Core (NestJS / Fastify) مع فحص الجاهزية (Health Check).
- `storefront`: تطبيق واجهة المتجر والمعرض المعماري (Next.js 14 Production Server).
- `admin`: لوحة التحكم الإدارية (Next.js Production Server).
- `nginx`: خادم عكسي (Reverse Proxy) لتوزيع الأحمال وإدارة شهادات SSL وتوجيه الـ Domains.

---

## 2. Environment Variables (.env)

يتم نسخ ملف `.env.example` إلى `.env` قبل التشغيل:

```env
# Node Environment
NODE_ENV=production
PORT=4000
API_URL=http://localhost:4000/api/v1

# Database Connection (PostgreSQL)
DATABASE_URL=postgresql://alwaheed_user:StrongPassword2026!@postgres:5432/alwaheed_db?schema=public

# Redis Connection
REDIS_URL=redis://redis:6379

# JWT Security
JWT_SECRET=super_secure_jwt_random_secret_key_alwaheed_2026
JWT_EXPIRES_IN=7d

# Storage Configuration (local | s3 | cloudinary)
STORAGE_PROVIDER=local
LOCAL_UPLOAD_PATH=./uploads
S3_ENDPOINT=
S3_BUCKET=
S3_ACCESS_KEY=
S3_SECRET_KEY=

# Verified Store Settings Defaults
STORE_NAME_AR=مؤسسة الوحيد للزخرفة المعمارية ونحت والمقاولات العامة
STORE_NAME_EN=Al-Waheed for Architectural Ornamentation & Stone Carving
STORE_PHONE=+967770663641
STORE_WHATSAPP=+967770663641
STORE_LOCATION=حده - فج عطان، صنعاء، الجمهورية اليمنية
STORE_CURRENCY=YER
```

---

## 3. Database Backup & Restore Procedures

### أخذ نسخة احتياطية دورية (Backup):
```bash
docker exec -t alwaheed_postgres pg_dump -U alwaheed_user -d alwaheed_db -F c -b -v -f /var/lib/postgresql/data/backup_$(date +%Y%m%d_%H%M%S).dump
```

### استعادة النسخة الاحتياطية (Restore):
```bash
docker exec -i alwaheed_postgres pg_restore -U alwaheed_user -d alwaheed_db -v /var/lib/postgresql/data/backup_target.dump
```
