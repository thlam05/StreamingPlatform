param(
    [string]$StreamName = "test"
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
    throw "ffmpeg is required and must be available on PATH."
}

$target = "rtmp://localhost:1935/live/$StreamName"
Write-Host "Publishing test stream to $target"
Write-Host "Stop with Ctrl+C"

ffmpeg `
    -hide_banner `
    -re `
    -f lavfi -i "testsrc2=size=1280x720:rate=30" `
    -f lavfi -i "sine=frequency=1000:sample_rate=48000" `
    -map 0:v:0 -map 1:a:0 `
    -c:v libx264 -preset veryfast -tune zerolatency `
    -pix_fmt yuv420p `
    -g 180 -keyint_min 180 -sc_threshold 0 `
    -c:a aac -b:a 128k -ar 48000 `
    -f flv $target

