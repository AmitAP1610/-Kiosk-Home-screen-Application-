$headers = @{ 'User-Agent' = 'Mozilla/5.0' }
try {
    $log = Invoke-RestMethod -Uri 'https://api.github.com/repos/AmitAP1610/-Kiosk-Home-screen-Application-/actions/jobs/129360045869/logs' -Headers $headers
    $lines = $log -split "`n"
    $lines | Select-String "temp.sh|DIRECT_MIRROR_URL|https://" | Select-Object -Last 10
} catch {
    Write-Output $_.Exception.Message
}

