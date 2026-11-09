$headers = @{ 'User-Agent' = 'Mozilla/5.0' }
$res = Invoke-RestMethod -Uri 'https://api.github.com/repos/AmitAP1610/-Kiosk-Home-screen-Application-/actions/runs?per_page=5' -Headers $headers
$res.workflow_runs | Select-Object id, name, status, conclusion, created_at, head_sha, html_url | Format-Table -AutoSize

