param(
  [string]$DumpDir = "H:\moodmarket\_db_migration"
)

$ErrorActionPreference = "Stop"

$pgBin = "C:\Program Files\PostgreSQL\17\bin"
if (Test-Path $pgBin) {
  $env:Path = "$pgBin;$env:Path"
}

foreach ($tool in @("pg_dump", "pg_restore", "psql")) {
  if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) {
    throw "Mangler verkt?y: $tool"
  }
}

if (-not (Test-Path $DumpDir)) {
  New-Item -ItemType Directory -Path $DumpDir | Out-Null
}

Write-Host "=== Supabase -> Neon database migration ===" -ForegroundColor Cyan
Write-Host "Skriv inn full PostgreSQL connection URL for hver database." -ForegroundColor Yellow
Write-Host "Eksempel: postgresql://USER:PASSWORD@HOST:5432/postgres?sslmode=require" -ForegroundColor DarkYellow

$sourceUrl = Read-Host "Supabase DATABASE URL (source)"
$targetUrl = Read-Host "Neon DATABASE URL (target)"

if ([string]::IsNullOrWhiteSpace($sourceUrl) -or [string]::IsNullOrWhiteSpace($targetUrl)) {
  throw "Kildedatabase og m?ldatabase m? settes."
}

$ts = Get-Date -Format "yyyyMMdd-HHmmss"
$dumpFile = Join-Path $DumpDir "supabase-full-$ts.dump"

Write-Host "[1/3] Eksporterer full database fra Supabase..." -ForegroundColor Cyan
& pg_dump --format=custom --no-owner --no-privileges --verbose --dbname="$sourceUrl" --file="$dumpFile"

if (-not (Test-Path $dumpFile)) {
  throw "Dumpfil ble ikke opprettet: $dumpFile"
}

Write-Host "[2/3] Laster inn dump i Neon (clean + if-exists)..." -ForegroundColor Cyan
& pg_restore --verbose --no-owner --no-privileges --clean --if-exists --dbname="$targetUrl" "$dumpFile"

Write-Host "[3/3] Verifiserer antall tabeller i sentrale schema..." -ForegroundColor Cyan
$verifySql = @"
select schemaname, count(*) as table_count
from pg_catalog.pg_tables
where schemaname not in ('pg_catalog','information_schema')
group by 1
order by 1;
"@

& psql "$targetUrl" -v ON_ERROR_STOP=1 -c "$verifySql"

Write-Host "Migrering fullf?rt." -ForegroundColor Green
Write-Host "Dumpfil: $dumpFile" -ForegroundColor Green
