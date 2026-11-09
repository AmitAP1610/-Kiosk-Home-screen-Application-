$headers = @{ 'User-Agent' = 'Mozilla/5.0' }
$rels = Invoke-RestMethod -Uri 'https://api.github.com/repos/AmitAP1610/-Kiosk-Home-screen-Application-/releases' -Headers $headers
foreach ($r in $rels) {
    Write-Output "=== Release: $($r.name) (tag: $($r.tag_name)) ==="
    Write-Output "Published: $($r.published_at)"
    $r.assets | Select-Object name, size, browser_download_url, updated_at | Format-Table -AutoSize
}

