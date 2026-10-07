#!/usr/bin/env bash
# Publish a new DyslexiQuest build so phones can update from the in-app button.
#
#   scripts/release.sh "What changed (shown to the user in the app)"
#
# Requires: a clean, committed git tree (versionCode = commit count) and `gh` logged in.
# Publishes to the PUBLIC repo thundergeek/dyslexiquest-releases (APK + latest.json only;
# the source code stays in the private repo).
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT="$PWD"
RELEASES_REPO="thundergeek/dyslexiquest-releases"
NOTES="${1:-Bug fixes and improvements}"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "✗ Uncommitted changes. Commit first so the version number matches the code:"
  git status --short
  exit 1
fi

VERSION_CODE=$(git rev-list --count HEAD)
VERSION_NAME="0.${VERSION_CODE}"
TAG="v${VERSION_CODE}"

# Refuse to publish something not newer than what's already out (e.g. built from an older branch).
LAST=$(gh release view --repo "$RELEASES_REPO" --json tagName -q .tagName 2>/dev/null | tr -d 'v' || echo 0)
if [[ -n "$LAST" && "$LAST" =~ ^[0-9]+$ && "$VERSION_CODE" -le "$LAST" ]]; then
  echo "✗ versionCode $VERSION_CODE is not newer than published v$LAST. Commit something new (or check your branch)."
  exit 1
fi

scripts/build.sh

mkdir -p dist
APK_NAME="dyslexiquest-${VERSION_CODE}.apk"
cp android/app/build/outputs/apk/debug/app-debug.apk "dist/$APK_NAME"
SHA=$(sha256sum "dist/$APK_NAME" | cut -d' ' -f1)
APK_URL="https://github.com/${RELEASES_REPO}/releases/download/${TAG}/${APK_NAME}"

python3 - "$VERSION_CODE" "$VERSION_NAME" "$APK_URL" "$SHA" "$NOTES" "$(git rev-parse --short HEAD)" > dist/latest.json <<'PY'
import json, sys, datetime
code, name, url, sha, notes, commit = sys.argv[1:]
print(json.dumps({
    "versionCode": int(code), "versionName": name, "apkUrl": url, "sha256": sha,
    "notes": notes, "commit": commit,
    "published": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
}, indent=2))
PY

echo "==> Publishing $TAG to $RELEASES_REPO"
gh release create "$TAG" "dist/$APK_NAME" dist/latest.json \
  --repo "$RELEASES_REPO" --title "DyslexiQuest $VERSION_NAME" --notes "$NOTES" --latest

echo "✓ Released $VERSION_NAME. Phones will see it under ☰ → APP VERSION → Check for updates."
