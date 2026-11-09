$headers = @{ 'User-Agent' = 'Mozilla/5.0' }
$rel = Invoke-RestMethod -Uri 'https://api.github.com/repos/AmitAP1610/-Kiosk-Home-screen-Application-/releases/tags/v1.0.0-apk' -Headers $headers
$rel.assets | ForEach-Object {
    Write-Output "File: $($_.name)"
    Write-Output "Size: $($_.size) bytes"
    Write-Output "Updated: $($_.updated_at)"
    Write-Output "URL: $($_.browser_download_url)"
}

