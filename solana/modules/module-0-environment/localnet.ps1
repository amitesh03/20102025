# Start a local validator with common flags
Write-Host "Starting solana-test-validator..."
Start-Process -NoNewWindow -FilePath "solana-test-validator" -ArgumentList @(
  "--reset",
  "--quiet",
  "--limit-ledger-size",
  "--bpf-programs"
) -PassThru | Out-Null
Write-Host "Use: solana config set --url http://127.0.0.1:8899"