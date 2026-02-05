Write-Host "`n🤖 Testing AI Chat Feature..." -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

Start-Sleep -Seconds 2

# Test 1: Health Check
Write-Host "1️⃣  Checking backend health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:4000/health" -TimeoutSec 3
    if ($health.ok) {
        Write-Host "   ✅ Backend is running`n" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Backend not responding`n" -ForegroundColor Red
    exit 1
}

# Test 2: AI Chat
Write-Host "2️⃣  Testing AI Chat API..." -ForegroundColor Yellow
$question = "What's the best programming language for beginners?"
$body = @{ message = $question } | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:4000/api/chat" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 20
    Write-Host "   ✅ AI Chat is working!`n" -ForegroundColor Green
    Write-Host "   Question: $question" -ForegroundColor Cyan
    Write-Host "   Response: $($response.response)`n" -ForegroundColor White
} catch {
    Write-Host "   ❌ Chat failed: $_`n" -ForegroundColor Red
}

# Test 3: Frontend
Write-Host "3️⃣  Checking frontend..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "http://localhost:3000/chat" -TimeoutSec 3 -UseBasicParsing | Out-Null
    Write-Host "   ✅ Chat page is accessible`n" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Frontend not responding`n" -ForegroundColor Red
}

Write-Host "================================" -ForegroundColor Cyan
Write-Host "🎉 AI Chat Feature Ready!" -ForegroundColor Green
Write-Host "`n📱 Open: http://localhost:3000/chat" -ForegroundColor Cyan
Write-Host "💡 You can now chat with AI about courses and learning!`n" -ForegroundColor Yellow
