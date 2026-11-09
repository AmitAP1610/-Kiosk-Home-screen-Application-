$headers = @{ 'User-Agent' = 'Mozilla/5.0' }
$jobs = Invoke-RestMethod -Uri 'https://api.github.com/repos/AmitAP1610/-Kiosk-Home-screen-Application-/actions/runs/42676746501/jobs' -Headers $headers
Write-Output ("Job ID: " + $jobs.jobs[0].id)
Write-Output ("HTML URL: " + $jobs.jobs[0].html_url)

