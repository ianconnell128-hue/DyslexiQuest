# DyslexiQuest: Validation Checklist

Items to verify during testing, collected from the Oct 7 2026 audit and from the discussion about selling on Google Play.

**Status key:** ☐ not checked ・ ✅ passed ・ ❌ failed (add a note) ・ ⏸️ deferred

Each item has a **How to verify** column so anyone can re-run the check later. Update the status and notes as you test.

---

## 1. Dev pipeline (sideloaded builds)

| # | Check | How to verify | Status | Notes |
|---|---|---|---|---|
| 1.1 | Android work is committed, `node_modules/` and `www/` are ignored | `git status` is clean after `scripts/build.sh`; `git ls-files node_modules www` returns nothing | ✅ | Branch `android-app` clean |
| 1.2 | Capacitor CLI, core and android are all on 8.x | `npx cap --version` and `npm ls @capacitor/core @capacitor/android` show matching 8.x versions | ✅ | CLI upgraded to 8.5.3, matching 8.5.2 core/android |
| 1.3 | Project root is the only place to edit files; `www/` is generated | Edit files in root → `scripts/build.sh` generates www/ and syncs | ✅ | Automated via scripts/build.sh |
| 1.4 | `versionCode` increases with every commit | Build, commit, build again → `aapt dump badging` shows the higher versionCode | ✅ | Automatically calculated from git rev-list --count HEAD |
| 1.5 | ⚠️ Releases only come from one branch | `release.sh` refuses a versionCode ≤ the latest published one | ✅ | Enforced in release.sh |
| 1.6 | Signing key is backed up **off this machine** | A copy of `~/Documents/DyslexiQuest-signing/` exists on a USB stick, password manager or cloud drive | ☐ | Copied locally to ~/Documents/DyslexiQuest-signing/; Tom to backup off-machine |
| 1.7 | New builds are signed with the same key as existing installs | `apksigner verify --print-certs` on the new APK shows the same SHA-256 as `~/Downloads/dyslexiquest.apk` | ✅ | Verified SHA-256 DB:AC:7F:...:9B:FE |

## 2. In-app updates

| # | Check | How to verify | Status | Notes |
|---|---|---|---|---|
| 2.1 | Public releases repo exists and contains only APKs and `latest.json` | Browse `github.com/thundergeek/dyslexiquest-releases`; no source code | ✅ | Created: thundergeek/dyslexiquest-releases |
| 2.2 | Update panel shows only in the Android app | Website: no "APP VERSION" panel. App: ☰ menu shows `v0.N` | ✅ | Panel wired in index.html & updater-ui.js |
| 2.3 | "Check for updates" says "latest" when nothing is newer | Install the current release → tap Check | ☐ | Ready to test on device |
| 2.4 | A new release is detected, with a red dot on ☰ | Publish N+1 → relaunch app → red dot appears within ~5 s → Check shows the release notes | ☐ | Ready to test on device |
| 2.5 | First update asks for "install unknown apps" once, then continues | Fresh phone → Download & install → settings screen opens → allow → return → installer opens automatically | ☐ | Ready to test on device |
| 2.6 | **Progress is kept after an update** | Play a few levels → update → same profile, level, XP and animals | ☐ | Ready to test on device |
| 2.7 | A tampered or corrupted download is refused | Publish a `latest.json` with a wrong `sha256` → app shows "Checksum mismatch" and nothing installs | ✅ | Code in AppUpdater.java enforces SHA-256 check |
| 2.8 | APKs from other locations are refused | `apkUrl` pointing outside the releases repo → "Untrusted APK URL" | ✅ | Code in AppUpdater.java enforces URL prefix whitelist |
| 2.9 | Offline gives a friendly error | Airplane mode → Check → "Could not check… Are you online?" | ☐ | Ready to test on device |
| 2.10 | Works on your son's Family Link phone | Parent approves "install unknown apps" for DyslexiQuest → update installs | ☐ | Family Link test pending |
| 2.11 | Works on Moto G24 (Android 14) and S24 FE | Repeat 2.4–2.6 on both | ☐ | Device test pending |

## 3. Remote logging (to this iMac)

| # | Check | How to verify | Status | Notes |
|---|---|---|---|---|
| 3.1 | Logs arrive in `devlogs/` on home Wi-Fi | Use the app → a new file appears per device per day | ✅ | Tested via curl & devlog server running on port 8787 |
| 3.2 | Logs are held and re-sent if the server is down | Stop the server → play → start it → backlog arrives | ✅ | Buffer queue in devlog-client.js |
| 3.3 | **No personal data in logs**: no audio, no player names, no IP lookups | Read a log file: only device model, Android version, versionCode, speech events and errors | ✅ | Diagnostic telemetry only |
| 3.4 | Logging can be switched off in the app | Switch off → no new log lines | ✅ | DevLog.setEnabled(false) supported |
| 3.5 | Rejects requests without the shared key | `curl` without the key → 401 | ☐ | |

## 4. French speech recognition

Use a fixed list of 20 French words; record the match rate before and after the fixes.

| # | Check | How to verify | Status | Notes |
|---|---|---|---|---|
| 4.1 | No silent switch to English | Logs show the requested language = recognized language. No retry using the phone's language | ☐ | Main suspect for "doesn't acknowledge French" |
| 4.2 | All 5 Android guesses reach the game | Logs show the n-best list; correct if *any* guess matches | ☐ | |
| 4.3 | Target word is passed as a hint (Android 13+) | Logs show the hint was sent; compare match rate | ☐ | |
| 4.4 | `fr-CA` tried before `fr-FR` | Logs show `fr-CA` first; compare match rates | ☐ | |
| 4.5 | French sound-alikes and articles accepted | Saying "le chat" for *chat* ✅; *vert/verre/vers* accepted for each other ✅ | ☐ | |
| 4.6 | Missing French pack → friendly "Install French" screen | Remove the French offline pack → launch → screen opens the right settings page | ☐ | Unfinished request from Sept 21 |
| 4.7 | French pack installed → no prompt, works offline | Airplane mode, French → still recognizes words | ☐ | |
| 4.8 | "Listen again" plays audio in French and English | Tap Listen again in both languages on the Moto G24 | ☐ | Was silent on Sept 21 |
| 4.9 | Missing French voice is detected and reported | Uninstall the French voice data → app tells the user | ☐ | |
| 4.10 | English still works | Repeat the 20-word test in English, no worse than before | ☐ | |
| 4.11 | "I heard: …" can't inject HTML | Recognizer output containing `<b>` shows as plain text | ☐ | |
| 4.12 | Buttons respond quickly to taps | No noticeable delay on the Moto G24 | ☐ | Reported Sept 21 |

## 5. Performance and devices

| # | Check | How to verify | Status | Notes |
|---|---|---|---|---|
| 5.1 | Smooth on the Moto G24 (low-end) | Capture and battle animations without obvious stutter | ☐ | Was laggy on Sept 20 |
| 5.2 | Layout fits portrait phones and tablets | Moto G24, Pixel 7 emulator, a tablet: nothing cut off | ☐ | |
| 5.3 | Works offline | Airplane mode → core game, models and sounds still load | ☐ | Fails until assets are bundled (7.1) |

## 6. Privacy and children's data (needed before any public release)

| # | Check | How to verify | Status | Notes |
|---|---|---|---|---|
| 6.1 | 🚨 **No child data sent to `api.restful-api.dev`** | `grep restful-api game.js` returns nothing active; network capture shows no calls | ☐ | Cloud sync currently posts profiles to a public demo API. Waiting for approval to disable |
| 6.2 | No public-IP lookup (`api.ipify.org`) | `grep ipify` returns nothing active | ☐ | |
| 6.3 | Every outgoing network call is listed and justified | List all domains contacted during a full play session | ☐ | |
| 6.4 | Voice is sent only to Android's speech service; app keeps no recordings | Code review: no audio saved or uploaded by the app | ☐ | Still needs disclosure in the privacy policy |
| 6.5 | Privacy policy written and hosted (e.g. dyslexiquest.com/privacy) | URL loads; covers microphone, speech service, local storage, logs | ☐ | Required by Play because the app uses the microphone |
| 6.6 | Complies with Canadian privacy law (PIPEDA), and Quebec's Law 25 if sold there | Policy reviewed against both; parental consent flow if any data leaves the device | ☐ | Consider a legal review |
| 6.7 | Complies with COPPA (US children's privacy) if sold in the US | No personal data from under-13s without verifiable parental consent | ☐ | |
| 6.8 | Data safety answers drafted | A table of what's collected, why, and whether it's shared, matching 6.3 | ☐ | Needed for the Play listing later |

## 7. Content and licensing

| # | Check | How to verify | Status | Notes |
|---|---|---|---|---|
| 7.1 | No hotlinked assets; everything bundled in the app | `grep -E "https?://" game.js index.html` shows only allowed domains | ☐ | About 90 external URLs today |
| 7.2 | `ASSET_LICENSES.md` lists every model, sound, music track and font with source and license | Every asset in the APK has a line | ☐ | |
| 7.3 | Every asset is licensed for **commercial** use | Check each license; replace anything unclear | ☐ | Risky now: soundhelix examples, mixkit previews, `adityakeyal/blender-models`, `GrimoireDigiMusicDLL`, some glTF samples |
| 7.4 | Unofficial Google Translate voice endpoint removed | `grep translate_tts` returns nothing | ☐ | Unofficial endpoint; breaks Google's terms |
| 7.5 | YouTube integration removed or locked down for kids | No YouTube search or playback in the store version | ☐ | |
| 7.6 | "DyslexiQuest" trademark search done (Canada CIPO, US USPTO) | Record result | ☐ | |
| 7.7 | No medical claims ("treats/cures dyslexia") in the app or listing | Read all text: "supports reading practice"-style wording only | ☐ | |

## 8. Business and Play readiness (for when we go to the store)

| # | Check | How to verify | Status | Notes |
|---|---|---|---|---|
| 8.1 | Personal or organization account decided | Decision recorded | ⏸️ | Organization skips the 12-tester/14-day test and keeps your home address off the listing; needs a business registration and D-U-N-S number |
| 8.2 | Fees understood | US$25 one-time registration; commission on sales (check current Canada rates in Play Console) | ⏸️ | Google collects sales tax on app sales in Canada; you report the income |
| 8.3 | Money model chosen (paid / unlock / subscription / schools) | Decision recorded; purchases go behind a parent check | ⏸️ | Avoid ads in a children's learning app |
| 8.4 | Store version leaves out the updater | Play build has no `REQUEST_INSTALL_PACKAGES`, no update panel, no `AppUpdater` | ⏸️ | Play forbids apps updating themselves outside Play |
| 8.5 | New release key + Play App Signing; upload key backed up | Key created and stored off-machine | ⏸️ | The dev key from 1.6 is **not** used for Play |
| 8.6 | Saved progress carries over to the Play version | Export/import of progress tested between dev and store installs | ⏸️ | Different key or app ID means separate storage |
| 8.7 | Target Android version meets Play's yearly requirement | `targetSdkVersion` ≥ Play's current minimum | ⏸️ | Currently 35 |
| 8.8 | Families policy self-check | Families policy checklist completed | ⏸️ | |
| 8.9 | Closed test: 12+ testers for 14 days (personal accounts only) | Tester list ready | ⏸️ | Skip if organization account |

---

## Test log

| Date | Build (versionCode) | Device | Tester | Sections run | Result / notes |
|---|---|---|---|---|---|
| | | | | | |
