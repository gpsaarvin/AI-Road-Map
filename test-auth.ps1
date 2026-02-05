# Test Authentication API Endpoints

# Base URL
$baseUrl = "http://localhost:4000"

Write-Host "`n=== Testing Authentication Endpoints ===" -ForegroundColor Cyan

# Test 1: Register a new user
Write-Host "`n1. Testing Registration..." -ForegroundColor Yellow
$timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$registerData = @{
    email = "test$timestamp@example.com"
    password = "password123"
    fullName = "Test User"
    username = "testuser$timestamp"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" `
        -Method Post `
        -Body $registerData `
        -ContentType "application/json"
    
    Write-Host "✅ Registration successful!" -ForegroundColor Green
    Write-Host "User: $($registerResponse.user.fullName)" -ForegroundColor Green
    Write-Host "Email: $($registerResponse.user.email)" -ForegroundColor Green
    Write-Host "Token: $($registerResponse.token.Substring(0, 20))..." -ForegroundColor Green
    
    $token = $registerResponse.token
} catch {
    Write-Host "❌ Registration failed: $_" -ForegroundColor Red
    $token = $null
}

# Test 2: Try to register with same email (should fail)
Write-Host "`n2. Testing Duplicate Registration..." -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$baseUrl/api/auth/register" `
        -Method Post `
        -Body $registerData `
        -ContentType "application/json" `
        -ErrorAction Stop
    
    Write-Host "❌ Duplicate registration should have failed!" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "✅ Duplicate registration correctly rejected" -ForegroundColor Green
    } else {
        Write-Host "❌ Unexpected error: $_" -ForegroundColor Red
    }
}

# Test 3: Login with correct credentials
Write-Host "`n3. Testing Login..." -ForegroundColor Yellow
$loginData = @{
    email = "test$timestamp@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" `
        -Method Post `
        -Body $loginData `
        -ContentType "application/json"
    
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "User: $($loginResponse.user.fullName)" -ForegroundColor Green
    Write-Host "Token: $($loginResponse.token.Substring(0, 20))..." -ForegroundColor Green
    
    $token = $loginResponse.token
} catch {
    Write-Host "❌ Login failed: $_" -ForegroundColor Red
}

# Test 4: Login with wrong password
Write-Host "`n4. Testing Login with Wrong Password..." -ForegroundColor Yellow
$wrongLoginData = @{
    email = "test$timestamp@example.com"
    password = "wrongpassword"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$baseUrl/api/auth/login" `
        -Method Post `
        -Body $wrongLoginData `
        -ContentType "application/json" `
        -ErrorAction Stop
    
    Write-Host "❌ Wrong password should have failed!" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Wrong password correctly rejected" -ForegroundColor Green
    } else {
        Write-Host "❌ Unexpected error: $_" -ForegroundColor Red
    }
}

# Test 5: Get current user with token
if ($token) {
    Write-Host "`n5. Testing Get Current User..." -ForegroundColor Yellow
    try {
        $headers = @{
            "Authorization" = "Bearer $token"
        }
        
        $meResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/me" `
            -Method Get `
            -Headers $headers
        
        Write-Host "✅ Get current user successful!" -ForegroundColor Green
        Write-Host "User: $($meResponse.fullName)" -ForegroundColor Green
        Write-Host "Email: $($meResponse.email)" -ForegroundColor Green
        Write-Host "Username: $($meResponse.username)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Get current user failed: $_" -ForegroundColor Red
    }
}

# Test 6: Get current user without token
Write-Host "`n6. Testing Get Current User Without Token..." -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$baseUrl/api/auth/me" `
        -Method Get `
        -ErrorAction Stop
    
    Write-Host "❌ Should have required authentication!" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Correctly requires authentication" -ForegroundColor Green
    } else {
        Write-Host "❌ Unexpected error: $_" -ForegroundColor Red
    }
}

Write-Host "`n=== Tests Complete ===" -ForegroundColor Cyan
