$body = @{ test = "ok"; timestamp = (Get-Date).ToString("o") } | ConvertTo-Json
$res = Invoke-RestMethod -Uri "https://vanhoc-3f624-default-rtdb.firebaseio.com/vanhoc12/test_sync.json" -Method Put -Body $body -ContentType "application/json; charset=utf-8"
Write-Host "Result:" ($res | ConvertTo-Json)
Invoke-RestMethod -Uri "https://vanhoc-3f624-default-rtdb.firebaseio.com/vanhoc12/test_sync.json" -Method Delete
Write-Host "Cleaned up successfully!"
