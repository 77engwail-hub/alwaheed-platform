@echo off
chcp 65001 > nul
title منصة الوحيد للزخرفة المعمارية والنحت - تشغيل فوري

echo ===============================================================================
echo     🏛️  منصة «الوحيد للزخرفة المعمارية والنحت والمقاولات العامة»
echo ===============================================================================
echo.
echo [1/4] التحقق من بيئة العمل والمتطلبات...
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo [خطأ] pnpm غير مثبت. يرجى تثبيت pnpm أولاً عبر: npm install -g pnpm
    pause
    exit /b 1
)

echo [2/4] تهيئة الحزم وقاعدة البيانات...
call pnpm --filter @al-waheed/types build
call pnpm --filter @al-waheed/validation build
call pnpm --filter @al-waheed/ui build

echo.
echo [3/4] فتح المتصفح تلقائياً...
start http://localhost:3000
start http://localhost:3001

echo.
echo [4/4] جاري تشغيل كافة الخدمات (Storefront + Admin + API)...
echo -------------------------------------------------------------------------------
echo   🌐 الموقع العام والمتجر:   http://localhost:3000
echo   ⚙️  لوحة التحكم والإدارة:  http://localhost:3001
echo   🔌 الخادم الخلفي (API):     http://localhost:4000/api/v1
echo.
echo   🔑 بيانات دخول لوحة الإدارة:
echo      - البريد: admin@alwaheed-stone.com
echo      - كلمة المرور: Admin@AlWaheed2026!
echo -------------------------------------------------------------------------------
echo اضغط Ctrl+C في أي وقت لإيقاف التشغيل.
echo.

pnpm dev
