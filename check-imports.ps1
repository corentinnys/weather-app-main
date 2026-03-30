# check-imports-table.ps1
# Vérifie tous les imports relatifs pour la casse et l'extension dans src/

$files = Get-ChildItem -Recurse -File -Include *.js,*.jsx,*.ts,*.tsx -Path ./src

$results = @()

foreach ($file in $files) {
    $content = Get-Content $file.FullName
    for ($i = 0; $i -lt $content.Count; $i++) {
        $line = $content[$i]

        if ($line -match "import\s+.*\s+from\s+['""](.+)['""]") {
            $importPath = $matches[1]

            # On ignore les imports externes (react, axios...)
            if ($importPath.StartsWith(".")) {
                # Liste des extensions possibles
                $exts = @(".js", ".jsx", ".ts", ".tsx")
                $found = $false
                $correctFile = $null

                foreach ($ext in $exts) {
                    $candidate = Join-Path $file.DirectoryName ($importPath + $ext)
                    if (Test-Path $candidate) {
                        $found = $true
                        $correctFile = [System.IO.Path]::GetFileName($candidate)
                        break
                    }
                }

                if (-not $found) {
                    $results += [PSCustomObject]@{
                        File = $file.FullName
                        Line = $i+1
                        Import = $importPath
                        Status = "⚠️ Fichier manquant"
                    }
                } elseif ($found) {
                    # Vérifie si la casse correspond
                    $actualFile = [System.IO.Path]::GetFileName($candidate)
                    if ($actualFile -ne ($importPath + $ext)) {
                        $results += [PSCustomObject]@{
                            File = $file.FullName
                            Line = $i+1
                            Import = $importPath
                            Status = "⚠️ Casse incorrecte → $actualFile"
                        }
                    }
                }
            }
        }
    }
}

# Affiche le résultat sous forme de tableau
if ($results.Count -eq 0) {
    Write-Host "✅ Tous les imports relatifs sont corrects !"
} else {
    $results | Format-Table -AutoSize
}