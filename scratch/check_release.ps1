$headers = @{ 'User-Agent' = 'Mozilla/5.0' }
$rel = Invoke-RestMethod -Uri 'https://api.github.com/repos/AmitAP1610/-Kiosk-Home-screen-Application-/releases/latest' -Headers $headers
Write-Output ("Tag: " + $rel.tag_name)
Write-Output ("Name: " + $rel.name)
Write-Output ("Published: " + $rel.published_at)
$rel.assets | Select-Object name, size, browser_download_url, updated_at | Format-Table -AutoSize

