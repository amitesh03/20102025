# Module 0: Environment & Prerequisites (Windows PowerShell)
# This script shows commands to install core toolchains.
# Review before running; some commands require admin or user confirmation.

Write-Host "=== Rust (MSVC toolchain) via winget ==="
# winget install -e --id Rustlang.Rust.MSVC
# rustup default stable
# rustc --version
# cargo --version

Write-Host "=== Solana CLI (Windows) ==="
# Installer: https://release.solana.com/stable/solana-install-init.exe
# Example (download & run):
# $installer = Join-Path $env:TEMP "solana-install-init.exe"
# Invoke-WebRequest -Uri "https://release.solana.com/stable/solana-install-init.exe" -OutFile $installer
# Start-Process -FilePath $installer -Wait
# solana --version
# solana config set --url https://api.devnet.solana.com
# solana airdrop 2

Write-Host "=== Node.js LTS via winget ==="
# winget install -e --id OpenJS.NodeJS.LTS
# node -v
# npm -v
# npm i -g pnpm

Write-Host "=== VSCode extensions (optional) ==="
# code --install-extension rust-lang.rust-analyzer
# code --install-extension tamasfe.even-better-toml
# code --install-extension esbenp.prettier-vscode

Write-Host "=== Local validator (example) ==="
# solana-test-validator
# In another terminal:
# solana config set --url http://127.0.0.1:8899
# solana airdrop 5
