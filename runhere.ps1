# PowerShell Launcher for Al-Waheed Platform
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "===============================================================================" -ForegroundColor Yellow
Write-Host "    🏛️  منصة «الوحيد للزخرفة المعمارية والنحت والمقاولات العامة»" -ForegroundColor Cyan
Write-Host "===============================================================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "[1/3] التحقق من الحزم وتجهيزها..." -ForegroundColor Green
pnpm --filter @al-waheed/types build | Out-Null
pnpm --filter @al-waheed/validation build | Out-Null
pnpm --filter @al-waheed/ui build | Out-Null

Write-Host "[2/3] فتح الروابط في المتصفح..." -ForegroundColor Green
Start-Process "http://localhost:3000"
Start-Process "http://localhost:3001"

Write-Host ""
Write-Host "[3/3] جاري تشغيل كافة الخدمات (Storefront + Admin + API)..." -ForegroundColor Cyan
Write-Host "-------------------------------------------------------------------------------" -ForegroundColor Gray
Write-Host "  🌐 الموقع العام والمتجر:   http://localhost:3000" -ForegroundColor White
Write-Host "  ⚙️  لوحة التحكم والإدارة:  http://localhost:3001" -ForegroundColor White
Write-Host "  🔌 الخادم الخلفي (API):     http://localhost:4000/api/v1" -ForegroundColor White
Write-Host ""
Write-Host "  🔑 بيانات دخول لوحة الإدارة:" -ForegroundColor Yellow
Write-Host "     - البريد: admin@alwaheed-stone.com" -ForegroundColor Gray
Write-Host "     - كلمة المرور: Admin@AlWaheed2026!" -ForegroundColor Gray
Write-Host "-------------------------------------------------------------------------------" -ForegroundColor Gray
Write-Host "اضغط Ctrl+C في أي وقت لإيقاف التشغيل." -ForegroundColor DarkYellow
Write-Host ""

pnpm dev
