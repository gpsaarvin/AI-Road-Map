# Test Profile API
# PowerShell script to test the profile save endpoint

Write-Host "🧪 Testing Profile API..." -ForegroundColor Cyan

# Test data
$profileData = @{
    email = "john.doe@example.com"
    fullName = "John Doe"
    username = "johndoe123"
    phone = "+1 234 567 8900"
    country = "United States"
    profileImage = ""
} | ConvertTo-Json

Write-Host "`n📤 Sending profile save request..." -ForegroundColor Yellow
Write-Host "URL: http://localhost:4000/api/profile" -ForegroundColor Gray
Write-Host "Data: $profileData" -ForegroundColor Gray

try {
    # Test POST /api/profile
    $response = Invoke-RestMethod -Uri "http://localhost:4000/api/profile" `
        -Method POST `
        -Body $profileData `
        -ContentType "application/json"
    
    Write-Host "`n✅ Profile saved successfully!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10 | Write-Host
    
    # Test GET /api/profile/:email
    Write-Host "`n📥 Fetching profile..." -ForegroundColor Yellow
    $fetchResponse = Invoke-RestMethod -Uri "http://localhost:4000/api/profile/john.doe@example.com" `
        -Method GET
    
    Write-Host "`n✅ Profile fetched successfully!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Cyan
    $fetchResponse | ConvertTo-Json -Depth 10 | Write-Host
    
} catch {
    Write-Host "`n❌ Error occurred!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        Write-Host "`nError Details:" -ForegroundColor Yellow
        $_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 10 | Write-Host
    }
}

Write-Host "`n✨ Test completed!" -ForegroundColor Cyan
