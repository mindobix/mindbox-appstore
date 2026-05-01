#!/usr/bin/env node
// After any dist:* build, copies DMG / EXE / AppImage into releases/latest/
// at the repo root. Run via: node scripts/copy-release.js

const fs   = require('fs')
const path = require('path')

const DIST_DIR    = path.join(__dirname, '..', 'dist')
const RELEASE_DIR = path.join(__dirname, '..', '..', 'releases', 'latest')

const EXTENSIONS = ['.dmg', '.exe', '.AppImage']

if (!fs.existsSync(DIST_DIR)) {
  console.error('No dist/ folder found — run a dist:* command first.')
  process.exit(1)
}

// Recreate releases/latest clean
fs.rmSync(RELEASE_DIR, { recursive: true, force: true })
fs.mkdirSync(RELEASE_DIR, { recursive: true })

const files = fs.readdirSync(DIST_DIR).filter(f =>
  EXTENSIONS.some(ext => f.endsWith(ext)) &&
  !f.includes('blockmap')   // skip .blockmap sidecar files
)

if (files.length === 0) {
  console.error('No DMG / EXE / AppImage found in dist/')
  process.exit(1)
}

for (const file of files) {
  const src  = path.join(DIST_DIR, file)
  const dest = path.join(RELEASE_DIR, file)
  fs.copyFileSync(src, dest)
  const size = (fs.statSync(dest).size / 1024 / 1024).toFixed(1)
  console.log(`  ✓  ${file}  (${size} MB)  →  releases/latest/`)
}

console.log(`\nReleases ready at: ${RELEASE_DIR}`)
