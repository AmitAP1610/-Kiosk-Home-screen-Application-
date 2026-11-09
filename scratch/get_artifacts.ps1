$headers = @{ 'User-Agent' = 'Mozilla/5.0' }
$artifacts = Invoke-RestMethod -Uri 'https://api.github.com/repos/AmitAP1610/-Kiosk-Home-screen-Application-/actions/runs/42676746501/artifacts' -Headers $headers
$artifacts.artifacts | Select-Object id, name, size_in_bytes, created_at | Format-Table -AutoSize

