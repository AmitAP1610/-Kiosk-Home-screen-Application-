$headers = @{ 'User-Agent' = 'Mozilla/5.0' }
$jobs = Invoke-RestMethod -Uri 'https://api.github.com/repos/AmitAP1610/-Kiosk-Home-screen-Application-/actions/runs/42676746501/jobs' -Headers $headers
$jobs.jobs[0].steps | Select-Object name, status, conclusion | Format-Table -AutoSize

