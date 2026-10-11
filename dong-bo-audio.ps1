# ==============================================================================
# TOOL DONG BO FILE AM THANH MP3 LEN GOOGLE FIREBASE CLOUD
# Du an: Cam Nang Van Hoc 12 (vanhoc-3f624)
# Ho tro: BAT KY FILE MP3 NAO deu duoc luu lai va dong bo cho hoc sinh nghe!
# ==============================================================================

param(
    [switch]$Watch = $false
)

$SCRIPT_DIR = $PSScriptRoot
if (-not $SCRIPT_DIR) { $SCRIPT_DIR = (Get-Location).Path }

$ROOT_AUDIO_DIR = Join-Path $SCRIPT_DIR "audio"
$WEB_AUDIO_DIR = Join-Path $SCRIPT_DIR "web\audio"
$FIREBASE_DB_URL = "https://vanhoc-3f624-default-rtdb.firebaseio.com"

if (-not (Test-Path $ROOT_AUDIO_DIR)) { New-Item -ItemType Directory -Path $ROOT_AUDIO_DIR -Force | Out-Null }
if (-not (Test-Path $WEB_AUDIO_DIR)) { New-Item -ItemType Directory -Path $WEB_AUDIO_DIR -Force | Out-Null }

function Show-Banner {
    Clear-Host
    Write-Host "==========================================================================" -ForegroundColor Cyan
    Write-Host "   [AUDIO CLOUD SYNC] DONG BO AM THANH MP3 LEN GOOGLE FIREBASE" -ForegroundColor Yellow
    Write-Host "   Du an: Cam Nang Van Hoc 12 (vanhoc-3f624)" -ForegroundColor Gray
    Write-Host "   Thu muc am thanh: $ROOT_AUDIO_DIR" -ForegroundColor DarkCyan
    Write-Host "==========================================================================" -ForegroundColor Cyan
    Write-Host ""
}

function Remove-Accents([string]$inputStr) {
    if (-not $inputStr) { return "" }
    $norm = $inputStr.Normalize([System.Text.NormalizationForm]::FormD)
    $chars = $norm.ToCharArray()
    $sb = New-Object System.Text.StringBuilder
    foreach ($c in $chars) {
        $cat = [System.Globalization.CharUnicodeInfo]::GetUnicodeCategory($c)
        if ($cat -ne [System.Globalization.UnicodeCategory]::NonSpacingMark) {
            [void]$sb.Append($c)
        }
    }
    $res = $sb.ToString().Normalize([System.Text.NormalizationForm]::FormC)
    $res = $res.Replace("d", "d").Replace("D", "D")
    return $res.ToLower()
}

function Get-WorksList {
    try {
        $url = "$FIREBASE_DB_URL/vanhoc12/works.json"
        $works = Invoke-RestMethod -Uri $url -Method Get -TimeoutSec 10
        if ($works) {
            return @($works)
        }
    } catch {
        Write-Host "Khong the tai tu Firebase, dang dung danh muc mac dinh..." -ForegroundColor Yellow
    }
    return @(
        @{ id = "vo-chong-a-phu"; title = "Vo Chong A Phu"; author = "To Hoai" },
        @{ id = "vo-nhat"; title = "Vo Nhat"; author = "Kim Lan" },
        @{ id = "tay-tien"; title = "Tay Tien"; author = "Quang Dung" },
        @{ id = "song-xuan-quynh"; title = "Song"; author = "Xuan Quynh" },
        @{ id = "dat-nuoc"; title = "Dat Nuoc"; author = "Nguyen Khoa Diem" },
        @{ id = "nguoi-lai-do-song-da"; title = "Nguoi Lai Do Song Da"; author = "Nguyen Tuan" },
        @{ id = "chiec-thuyen-ngoai-xa"; title = "Chiec Thuyen Ngoai Xa"; author = "Nguyen Minh Chau" },
        @{ id = "don-ki-ho-te"; title = "Don Ki-ho-te"; author = "Cervantes" }
    )
}

function Find-Work([string]$fileName, $worksList) {
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($fileName)
    $clean = Remove-Accents $baseName
    $clean = $clean -replace '[^a-z0-9]', ' '
    $clean = ($clean -replace '\s+', ' ').Trim()

    foreach ($w in $worksList) {
        $wIdClean = ($w.id.ToLower() -replace '-', ' ')
        if ($clean -eq $wIdClean -or $clean -eq ($w.id.ToLower())) {
            return $w
        }
    }

    $map = @{
        "vo chong a phu" = "vo-chong-a-phu"
        "vochongaphu" = "vo-chong-a-phu"
        "a phu" = "vo-chong-a-phu"
        "vo nhat" = "vo-nhat"
        "vonhat" = "vo-nhat"
        "tay tien" = "tay-tien"
        "taytien" = "tay-tien"
        "song" = "song-xuan-quynh"
        "song xuan quynh" = "song-xuan-quynh"
        "dat nuoc" = "dat-nuoc"
        "datnuoc" = "dat-nuoc"
        "song da" = "nguoi-lai-do-song-da"
        "lai do song da" = "nguoi-lai-do-song-da"
        "nguoi lai do song da" = "nguoi-lai-do-song-da"
        "chiec thuyen ngoai xa" = "chiec-thuyen-ngoai-xa"
        "thuyen ngoai xa" = "chiec-thuyen-ngoai-xa"
        "don ki ho te" = "don-ki-ho-te"
        "don kihote" = "don-ki-ho-te"
    }

    foreach ($k in $map.Keys) {
        if ($clean -match "\b$k\b" -or $clean -eq $k) {
            $mId = $map[$k]
            $match = $worksList | Where-Object { $_.id -eq $mId } | Select-Object -First 1
            if ($match) { return $match }
        }
    }

    foreach ($w in $worksList) {
        $tClean = Remove-Accents $w.title
        $tClean = $tClean -replace '[^a-z0-9]', ' '
        $tClean = ($tClean -replace '\s+', ' ').Trim()
        if ($clean -match "\b$tClean\b" -or $tClean -match "\b$clean\b") {
            return $w
        }
    }

    return $null
}

function Sync-AudioFile($fileInfo, $worksList) {
    $fileName = $fileInfo.Name
    $filePath = $fileInfo.FullName
    $sizeKB = [math]::Round($fileInfo.Length / 1024, 1)
    $sizeMB = [math]::Round($fileInfo.Length / (1024 * 1024), 2)

    Write-Host "[>] Dang xu ly file: $fileName ($sizeKB KB / $sizeMB MB)" -ForegroundColor White

    $targetWeb = Join-Path $WEB_AUDIO_DIR $fileName
    $targetRoot = Join-Path $ROOT_AUDIO_DIR $fileName
    try {
        if ($filePath -ne $targetWeb -and -not (Test-Path $targetWeb)) {
            Copy-Item -Path $filePath -Destination $targetWeb -Force
        }
        if ($filePath -ne $targetRoot -and -not (Test-Path $targetRoot)) {
            Copy-Item -Path $filePath -Destination $targetRoot -Force
        }
    } catch {}

    # Kiem tra xem co trung khop voi tac pham van hoc nao khong
    $matched = Find-Work $fileName $worksList
    $baseNameOnly = [System.IO.Path]::GetFileNameWithoutExtension($fileName)

    if ($matched) {
        $audioId = $matched.id
        $audioTitle = $matched.title
        $workId = $matched.id
        Write-Host "  [OK] Khop voi bai hoc: $audioTitle [ID: $audioId]" -ForegroundColor Green
    } else {
        # Bat cu file mp3 nao deu duoc luu lai, khong bat buoc phai theo ten van hoc!
        $cleanSlug = (Remove-Accents $baseNameOnly) -replace '[^a-z0-9]', '-' -replace '-+', '-'
        $cleanSlug = $cleanSlug.Trim('-')
        if (-not $cleanSlug) { $cleanSlug = "audio-" + [DateTimeOffset]::UtcNow.ToUnixTimeSeconds() }
        $audioId = $cleanSlug
        $audioTitle = $baseNameOnly
        $workId = $null
        Write-Host "  [OK] Nhan dien: Ban thu am MP3 [$fileName] -> ID: $audioId" -ForegroundColor Green
    }

    Write-Host "  [..] Dang doc file va ma hoa Base64..." -ForegroundColor DarkGray

    $bytes = [System.IO.File]::ReadAllBytes($filePath)
    $base64 = [Convert]::ToBase64String($bytes)

    $ext = [System.IO.Path]::GetExtension($fileName).ToLower()
    $mime = "audio/mp3"
    if ($ext -eq ".wav") { $mime = "audio/wav" }
    elseif ($ext -eq ".m4a") { $mime = "audio/mp4" }
    elseif ($ext -eq ".ogg") { $mime = "audio/ogg" }

    $fullData = "data:" + $mime + ";base64," + $base64
    $chunkSize = 200000
    $totalChunks = [int][Math]::Ceiling($fullData.Length / $chunkSize)
    $chunksObj = @{}

    for ($i = 0; $i -lt $totalChunks; $i++) {
        $start = $i * $chunkSize
        $len = [Math]::Min($chunkSize, $fullData.Length - $start)
        $chunksObj["c_$i"] = $fullData.Substring($start, $len)
    }

    $payloadObj = @{
        id = $audioId
        title = $audioTitle
        workId = $workId
        fileName = $fileName
        totalChunks = $totalChunks
        chunks = $chunksObj
        fileSizeBytes = $fileInfo.Length
        updatedAt = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
    }
    $payloadJson = $payloadObj | ConvertTo-Json -Depth 5 -Compress

    Write-Host "  [..] Dang tai len Firebase Cloud ($totalChunks chunks)..." -ForegroundColor Cyan
    $uploadUrl = "$FIREBASE_DB_URL/vanhoc12/audios/$audioId.json"

    try {
        $null = Invoke-RestMethod -Uri $uploadUrl -Method Put -Body $payloadJson -ContentType "application/json; charset=utf-8" -TimeoutSec 45

        # Cap nhat vao danh sach audioPlaylist de tat ca hoc sinh deu thay va nghe duoc
        $metaObj = @{
            id = $audioId
            title = $audioTitle
            fileName = $fileName
            workId = $workId
            fileSizeBytes = $fileInfo.Length
            updatedAt = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
        }
        $metaJson = $metaObj | ConvertTo-Json -Depth 3 -Compress
        $playlistUrl = "$FIREBASE_DB_URL/vanhoc12/audioPlaylist/$audioId.json"
        $null = Invoke-RestMethod -Uri $playlistUrl -Method Put -Body $metaJson -ContentType "application/json; charset=utf-8" -TimeoutSec 15

        Write-Host "  [SUCCESS] Da luu '$fileName' len Firebase cho tat ca hoc sinh nghe!" -ForegroundColor Green

        if ($matched) {
            $wIdx = -1
            for ($k = 0; $k -lt $worksList.Count; $k++) {
                if ($worksList[$k].id -eq $matched.id) {
                    $wIdx = $k
                    break
                }
            }
            if ($wIdx -ge 0) {
                $flagUrl = "$FIREBASE_DB_URL/vanhoc12/works/$wIdx/hasCustomAudio.json"
                $nameUrl = "$FIREBASE_DB_URL/vanhoc12/works/$wIdx/customAudioName.json"
                $null = Invoke-RestMethod -Uri $flagUrl -Method Put -Body "true" -ContentType "application/json" -TimeoutSec 10
                $null = Invoke-RestMethod -Uri $nameUrl -Method Put -Body "`"$fileName`"" -ContentType "application/json" -TimeoutSec 10
                Write-Host "  [OK] Da gan huy hieu 'Co Ban Thu MP3' vao bai $($matched.title)!" -ForegroundColor Green
            }
        }
        Write-Host ""
    } catch {
        Write-Host "  [ERROR] Loi dong bo: $($_.Exception.Message)`n" -ForegroundColor Red
    }
}

function Run-Batch {
    Show-Banner
    Write-Host "[*] Dang quet cac file am thanh trong thu muc..." -ForegroundColor Cyan

    $audioExts = @("*.mp3", "*.wav", "*.m4a", "*.ogg")
    $files = @()
    foreach ($ext in $audioExts) {
        $files += Get-ChildItem -Path $ROOT_AUDIO_DIR -Filter $ext -File -ErrorAction SilentlyContinue
        $files += Get-ChildItem -Path $WEB_AUDIO_DIR -Filter $ext -File -ErrorAction SilentlyContinue
    }

    $unique = @{}
    foreach ($f in $files) {
        if (-not $unique.ContainsKey($f.Name.ToLower())) {
            $unique[$f.Name.ToLower()] = $f
        }
    }
    $fileList = @($unique.Values)

    if ($fileList.Count -eq 0) {
        Write-Host "[i] Chua co file am thanh (.mp3, .wav, .m4a) nao trong thu muc!" -ForegroundColor Yellow
        Write-Host "Hay copy hoac tha BAT KY file .mp3 nao vao: $ROOT_AUDIO_DIR" -ForegroundColor White
        Write-Host "He thong se tu dong luu va dong bo cho hoc sinh nghe!" -ForegroundColor Green
        Write-Host ""
        return
    }

    Write-Host "[OK] Tim thay $($fileList.Count) file am thanh. Dang ket noi Firebase..." -ForegroundColor Green
    $worksList = Get-WorksList
    Write-Host "[OK] Bat dau dong bo toan bo file am thanh..." -ForegroundColor Green
    Write-Host ""

    foreach ($f in $fileList) {
        Sync-AudioFile $f $worksList
    }

    Write-Host "==========================================================================" -ForegroundColor Green
    Write-Host "HOAN TAT DONG BO TOAN BO FILE AM THANH LEN GOOGLE FIREBASE!" -ForegroundColor Yellow
    Write-Host "Tat ca hoc sinh mo trang web deu nghe duoc cac file nay ngay lap tuc." -ForegroundColor White
    Write-Host "==========================================================================" -ForegroundColor Green
}

function Run-Watcher {
    Show-Banner
    Write-Host "[WATCH MODE] CHE DO CANH CHUNG THU MUC DANG HOAT DONG..." -ForegroundColor Green
    Write-Host "Moi khi ban them BAT KY file .mp3 nao vao: $ROOT_AUDIO_DIR" -ForegroundColor White
    Write-Host "He thong se TU DONG phat hien va dong bo ngay len Firebase cho hoc sinh nghe!" -ForegroundColor Yellow
    Write-Host "(Nhan Ctrl+C de dung)" -ForegroundColor DarkGray
    Write-Host "--------------------------------------------------------------------------" -ForegroundColor Gray

    Run-Batch

    $watcher = New-Object System.IO.FileSystemWatcher
    $watcher.Path = $ROOT_AUDIO_DIR
    $watcher.Filter = "*.*"
    $watcher.IncludeSubdirectories = $false
    $watcher.EnableRaisingEvents = $true

    $recent = @{}
    $action = {
        param($source, $eventArgs)
        $ext = [System.IO.Path]::GetExtension($eventArgs.Name).ToLower()
        if ($ext -in @(".mp3", ".wav", ".m4a", ".ogg")) {
            $p = $eventArgs.FullPath
            $now = Get-Date
            if ($recent.ContainsKey($p)) {
                if (($now - $recent[$p]).TotalSeconds -lt 3) { return }
            }
            $recent[$p] = $now

            Start-Sleep -Milliseconds 800
            if (Test-Path $p) {
                Write-Host "`n[+] Phat hien file moi: $($eventArgs.Name)" -ForegroundColor Yellow
                $item = Get-Item $p
                $wList = Get-WorksList
                Sync-AudioFile $item $wList
                Write-Host "[*] Tiep tuc canh chung thu muc..." -ForegroundColor DarkCyan
            }
        }
    }

    $evCreated = Register-ObjectEvent -InputObject $watcher -EventName "Created" -Action $action
    $evChanged = Register-ObjectEvent -InputObject $watcher -EventName "Changed" -Action $action

    try {
        while ($true) {
            Start-Sleep -Seconds 1
        }
    } finally {
        Unregister-Event -SourceIdentifier $evCreated.Name -ErrorAction SilentlyContinue
        Unregister-Event -SourceIdentifier $evChanged.Name -ErrorAction SilentlyContinue
        $watcher.Dispose()
    }
}

if ($Watch) {
    Run-Watcher
} else {
    Run-Batch
}
