$url = 'https://github.com/AmitAP1610/-Kiosk-Home-screen-Application-/releases/download/v1.0.0-apk/KIOSK-AMR-v1.0.0.apk'
$outFile = 'dist-apk/KIOSK-AMR.apk'
New-Item -ItemType Directory -Force -Path 'dist-apk'
Invoke-WebRequest -Uri $url -OutFile $outFile
Get-Item $outFile | Select-Object Name, Length, LastWriteTime

