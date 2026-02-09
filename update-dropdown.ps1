$newDropdown = @"
                        <ul class="dropdown-menu">
                            <li><a href="dich-vu-y-khoa.html">Nội - Ngoại Tiêu Hóa</a></li>
                            <li><a href="dich-vu-y-khoa.html">Tim Mạch</a></li>
                            <li><a href="dich-vu-y-khoa.html">Tầm Soát Đột Quỵ</a></li>
                            <li><a href="dich-vu-y-khoa.html">Tầm Soát Ung Thư</a></li>
                            <li><a href="noi-soi.html">Nội Soi Tiêu Hóa</a></li>
                            <li><a href="dich-vu-y-khoa.html">Sản - Phụ Khoa</a></li>
                            <li><a href="dich-vu-y-khoa.html">Nội Ngoại Nhi</a></li>
                            <li><a href="dich-vu-y-khoa.html">Chẩn Đoán Hình Ảnh</a></li>
                            <li><a href="dich-vu-y-khoa.html">Xét Nghiệm</a></li>
                            <li><a href="tiem-chung.html">Trung Tâm Tiêm Chủng</a></li>
                        </ul>
"@

$files = @(
    'about.html',
    'contact.html',
    'noi-soi.html',
    'news.html',
    'tiem-chung.html',
    'gian-hang-xuan-2026.html',
    'package-details.html',
    'trang-thiet-bi.html',
    'dich-vu-y-khoa.html'
)

foreach ($f in $files) {
    $path = Join-Path $PSScriptRoot $f
    $content = [System.IO.File]::ReadAllText($path)
    
    # Match the dropdown-menu ul and all its contents up to the closing </ul>
    $pattern = '(?s)<ul class="dropdown-menu">.*?</ul>\s*(?=</li>\s*<li><a href="news\.html")'
    
    if ($content -match $pattern) {
        $newContent = $content -replace $pattern, $newDropdown
        [System.IO.File]::WriteAllText($path, $newContent)
        Write-Host "UPDATED: $f"
    } else {
        Write-Host "NO MATCH: $f"
    }
}
