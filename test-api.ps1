Start-Sleep -Seconds 2

Write-Host "`n=== BACKEND HEALTH ===" -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod -Uri "http://localhost:4000/health" -TimeoutSec 5
    if ($health.ok) {
        Write-Host "✅ Backend is RUNNING" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Backend Failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== AI GENERATION TEST ===" -ForegroundColor Cyan
try {
    $body = '{"courseName":"Python"}'
    $ai = Invoke-RestMethod -Uri "http://localhost:4000/api/roadmap/generate" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 20
    if ($ai.roadmap.levels) {
        Write-Host "✅ AI Generated $($ai.roadmap.levels.Count) levels" -ForegroundColor Green
        Write-Host "   First level: $($ai.roadmap.levels[0].level) with $($ai.roadmap.levels[0].topics.Count) topics"
    }
} catch {
    Write-Host "❌ AI Failed: $_" -ForegroundColor Red
}

Write-Host "`n=== YOUTUBE API TEST ===" -ForegroundColor Cyan
try {
    $yt = Invoke-RestMethod -Uri "http://localhost:4000/api/videos/search?topic=JavaScript" -TimeoutSec 5
    if ($yt.videos) {
        Write-Host "✅ YouTube returned $($yt.videos.Count) videos" -ForegroundColor Green
        Write-Host "   Sample: $($yt.videos[0].title)"
    }
} catch {
    Write-Host "❌ YouTube Failed: $_" -ForegroundColor Red
}

Write-Host "`n=== ALL TESTS COMPLETE ===" -ForegroundColor Green
