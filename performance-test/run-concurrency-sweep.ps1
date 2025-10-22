# Run a concurrency sweep for Product API Performance Test using JMeter CLI
# Usage (PowerShell):
#   ./run-concurrency-sweep.ps1 -JMeterHome "C:\\tools\\apache-jmeter-5.6.3" -Levels 50,100,200,400 -Loops 120 -Ramp 20
# Notes:
# - Ensure JAVA_HOME is set and JMeter is installed
# - Results will be saved to performance-test/results/sweeps/<timestamp>/*

param(
  [string]$JMeterHome = $env:JMETER_HOME,
  [int[]]$Levels = @(50,100,200,400),
  [int]$Loops = 120,
  [int]$Ramp = 20
)

if (-not $JMeterHome) {
  Write-Error "Please provide -JMeterHome or set JMETER_HOME environment variable."; exit 1
}

$workspace = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = Split-Path -Parent $workspace
$resultsRoot = Join-Path $workspace "results"
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$outDir = Join-Path $resultsRoot ("sweeps/" + $stamp)
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$jmx = Join-Path $workspace "Product_API_Performance_Test.jmx"
$jmeter = Join-Path $JMeterHome "bin/jmeter.bat"

foreach ($lvl in $Levels) {
  $label = "threads_${lvl}_r${Ramp}_l${Loops}"
  $jtl = Join-Path $outDir ("${label}.jtl")
  $csv = Join-Path $outDir ("${label}_summary.csv")
  Write-Host "Running: $label" -ForegroundColor Cyan
  & $jmeter -n -t $jmx -Jthreads=$lvl -Jramp=$Ramp -Jloops=$Loops -l $jtl -JsummaryFile=$csv | Write-Host
}

Write-Host "\nSweep completed. Results at: $outDir" -ForegroundColor Green
