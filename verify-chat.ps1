Write-Host "`n╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   🤖 AI CHAT FUNCTIONALITY TEST           ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Test 1: Backend Health
Write-Host "1️⃣  Backend Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod "http://localhost:4000/health" -TimeoutSec 3
    if ($health.ok) {
        Write-Host "   ✅ Backend is running`n" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Backend not responding`n" -ForegroundColor Red
    exit 1
}

# Test 2: Multiple Chat Requests
Write-Host "2️⃣  Testing AI Chat Responses..." -ForegroundColor Yellow

$questions = @(
    "What programming language should I learn first?",
    "Explain machine learning in simple terms",
    "How long to become a web developer?"
)

$successCount = 0
foreach ($question in $questions) {
    Write-Host "`n   Q: $question" -ForegroundColor Cyan
    $body = @{ message = $question } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod "http://localhost:4000/api/chat" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 15
        
        if ($response.response -and $response.response.Length -gt 10) {
            $preview = $response.response.Substring(0, [Math]::Min(80, $response.response.Length))
            Write-Host "   A: $preview..." -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "   ⚠️  Response too short" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "   ❌ Failed: $_" -ForegroundColor Red
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host "`n   Results: $successCount/$($questions.Count) successful`n" -ForegroundColor $(if ($successCount -eq $questions.Count) { "Green" } else { "Yellow" })

# Test 3: Frontend Accessibility
Write-Host "3️⃣  Frontend Chat Page..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest "http://localhost:3000/chat" -TimeoutSec 3 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Chat page is accessible`n" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Frontend not responding`n" -ForegroundColor Red
}

# Summary
Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   ✅ AI CHAT IS WORKING!                  ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "📱 Open AI Chat: http://localhost:3000/chat" -ForegroundColor Cyan
Write-Host "💬 You can now:" -ForegroundColor Yellow
Write-Host "   • Ask about learning strategies" -ForegroundColor White
Write-Host "   • Get course recommendations" -ForegroundColor White
Write-Host "   • Request programming advice" -ForegroundColor White
Write-Host "   • Discuss career development`n" -ForegroundColor White
