#!/usr/bin/env bash
# Build the DyslexiQuest Android APK.
#
#   scripts/build.sh            -> android/app/build/outputs/apk/debug/app-debug.apk
#   scripts/build.sh --install  -> also installs on the connected phone/emulator (adb)
#
# The project ROOT is the single source of truth (it's also what Netlify serves).
# www/ is generated here - never edit files in www/ by hand.
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT="$PWD"

export ANDROID_HOME="${ANDROID_HOME:-$HOME/Android/Sdk}"
export PATH="$ANDROID_HOME/platform-tools:$PATH"

echo "==> Generating www/ from project root"
rm -rf www
mkdir -p www
rsync -a \
  --exclude '.git/' --exclude '.gitignore' \
  --exclude 'node_modules/' --exclude 'android/' --exclude 'www/' \
  --exclude 'scripts/' --exclude 'devlog-server/' --exclude 'devlogs/' --exclude 'dist/' \
  --exclude 'package.json' --exclude 'package-lock.json' --exclude 'capacitor.config.json' \
  --exclude 'netlify.toml' --exclude '*.md' \
  "$ROOT/" "$ROOT/www/"

echo "==> Capacitor sync"
npx cap sync android >/dev/null

echo "==> Gradle assembleDebug"
APK="$ROOT/android/app/build/outputs/apk/debug/app-debug.apk"
rm -f "$APK"
(cd android && ./gradlew -q assembleDebug)
[[ -f "$APK" ]] || { echo "Build failed: no APK"; exit 1; }

VERSION_CODE=$(git rev-list --count HEAD)
echo "==> Built $APK (versionCode $VERSION_CODE, $(du -h "$APK" | cut -f1))"

if [[ "${1:-}" == "--install" ]]; then
  echo "==> Installing via adb"
  adb install -r "$APK"
fi
