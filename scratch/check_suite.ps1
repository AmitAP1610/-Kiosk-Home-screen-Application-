$suite = Invoke-RestMethod -Uri "https://api.github.com/repos/AmitAP1610/-Kiosk-Home-screen-Application-/check-suites/115572732328/check-runs" -Headers @{ "User-Agent" = "PowerShell" }
foreach ($cr in $suite.check_runs) {
    Write-Output "CheckRun: $($cr.name), Status: $($cr.status), Conclusion: $($cr.conclusion)"
    Write-Output "Output title: $($cr.output.title)"
    Write-Output "Output summary: $($cr.output.summary)"
    Write-Output "Output text: $($cr.output.text)"
}

