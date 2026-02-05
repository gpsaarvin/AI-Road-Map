#!/usr/bin/env pwsh
# Test YouTube Video API Endpoint

Write-Host "🧪 Testing YouTube Video Search API..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:4000"
$testTopics = @("javascript", "python", "react")

Write-Host "📡 Testing server health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Write-Host "✅ Server is running!" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Server is not running. Start it with 'npm run dev' in server folder" -ForegroundColor Red
    exit 1
}

foreach ($topic in $testTopics) {
    Write-Host "🔍 Searching videos for: $topic" -ForegroundColor Yellow
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/videos/search?topic=$topic" -Method Get
        $videos = $response.videos
        
        Write-Host "✅ Found $($videos.Count) videos" -ForegroundColor Green
        
        # Display first video details
        if ($videos.Count -gt 0) {
            $video = $videos[0]
            Write-Host ""
            Write-Host "  📹 First Video:" -ForegroundColor Cyan
            Write-Host "     Title: $($video.title)"
            Write-Host "     Channel: $($video.channel)"
            Write-Host "     Video ID: $($video.videoId)"
            Write-Host "     Thumbnail: $(if ($video.thumbnail) { '✅ Present' } else { '❌ Missing' })"
            Write-Host "     URL: $($video.href)"
            
            # Validate required fields
            $hasVideoId = $video.videoId -ne $null -and $video.videoId -ne ""
            $hasThumbnail = $video.thumbnail -ne $null -and $video.thumbnail -ne ""
            $hasHttps = $video.thumbnail -like "https://*"
            
            Write-Host ""
            Write-Host "  ✔️ Validation:" -ForegroundColor Cyan
            Write-Host "     Video ID: $(if ($hasVideoId) { '✅' } else { '❌' })"
            Write-Host "     Thumbnail: $(if ($hasThumbnail) { '✅' } else { '❌' })"
            Write-Host "     HTTPS: $(if ($hasHttps) { '✅' } else { '❌' })"
        }
        
        Write-Host ""
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
        Write-Host ""
        
    } catch {
        Write-Host "❌ Error searching videos: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
    }
}

Write-Host ""
Write-Host "🎉 Test completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Check server logs for [YouTube Service] and [Video Route] messages"
Write-Host "   2. Start frontend: cd app && npm run dev"
Write-Host "   3. Navigate to any roadmap page"
Write-Host "   4. Check browser console for [Roadmap] and [VideoCard] logs"
Write-Host ""
