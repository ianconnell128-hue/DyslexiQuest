/**
 * DyslexiQuest in-app updater UI.
 * Talks to the native window.AndroidUpdater (AppUpdater.java). Does nothing on the website.
 */
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  let latest = null;
  let waitingForPermission = false;

  function bridge() {
    return (window.AndroidUpdater && typeof window.AndroidUpdater.checkForUpdate === 'function')
      ? window.AndroidUpdater : null;
  }

  function setStatus(text, color) {
    const el = $('update-status');
    if (!el) return;
    el.textContent = text || '';
    el.style.color = color || 'var(--text-light)';
  }

  function setProgress(pct) {
    const wrap = $('update-progress-wrap'), bar = $('update-progress-bar');
    if (!wrap || !bar) return;
    if (pct == null) { wrap.style.display = 'none'; return; }
    wrap.style.display = 'block';
    bar.style.width = (pct < 0 ? 100 : Math.min(100, pct)) + '%';
  }

  function setBadge(on) {
    // Small red dot on the sidebar menu button when an update is waiting.
    const toggle = $('sidebar-toggle');
    if (!toggle) return;
    toggle.style.position = toggle.style.position || 'relative';
    let dot = $('update-badge-dot');
    if (on && !dot) {
      dot = document.createElement('span');
      dot.id = 'update-badge-dot';
      dot.style.cssText = 'position:absolute;top:4px;right:4px;width:10px;height:10px;border-radius:50%;background:#ef4444;border:2px solid white;';
      toggle.appendChild(dot);
    } else if (!on && dot) {
      dot.remove();
    }
  }

  function check(silent) {
    const b = bridge();
    if (!b) return;
    if (!silent) {
      setStatus('Checking…');
      $('update-check-btn').disabled = true;
    }
    window.__updateCheckSilent = !!silent;
    b.checkForUpdate();
  }

  window.__onUpdateCheck = function (r) {
    const silent = window.__updateCheckSilent;
    const checkBtn = $('update-check-btn'), installBtn = $('update-install-btn');
    if (checkBtn) checkBtn.disabled = false;
    if (!r || !r.ok) {
      if (!silent) setStatus('Could not check for updates. Are you online?', 'var(--secondary)');
      console.warn('[Updater] check failed', r && r.error);
      return;
    }
    latest = r.latest;
    if (r.updateAvailable) {
      setStatus(`New version ${latest.versionName} available!` + (latest.notes ? `\n${latest.notes}` : ''), 'var(--primary)');
      $('update-status').style.whiteSpace = 'pre-line';
      if (installBtn) installBtn.style.display = 'block';
      setBadge(true);
    } else {
      if (!silent) setStatus('You have the latest version ✨', 'var(--accent)');
      if (installBtn) installBtn.style.display = 'none';
      setBadge(false);
    }
  };

  window.__onUpdateProgress = function (p) {
    const installBtn = $('update-install-btn');
    switch (p.state) {
      case 'downloading':
        setStatus(p.percent >= 0 ? `Downloading… ${p.percent}%` : 'Downloading…');
        setProgress(p.percent);
        break;
      case 'verifying':
        setStatus('Checking download…');
        break;
      case 'needs-permission':
        waitingForPermission = true;
        setProgress(null);
        setStatus('One-time step: turn ON "Allow from this source" for DyslexiQuest, then come back.', 'var(--primary)');
        break;
      case 'installing':
        waitingForPermission = false;
        setProgress(null);
        setStatus('Opening installer… tap "Update".', 'var(--accent)');
        if (installBtn) installBtn.disabled = false;
        break;
      case 'error':
        setProgress(null);
        setStatus('Update failed: ' + (p.error || 'unknown error'), 'var(--secondary)');
        if (installBtn) installBtn.disabled = false;
        console.error('[Updater]', p.error);
        break;
    }
  };

  function init() {
    const b = bridge();
    const panel = $('update-panel');
    if (!b || !panel) return; // website, or bridge not attached
    panel.style.display = 'block';

    try {
      const info = JSON.parse(b.getVersionInfo() || '{}');
      $('update-current-version').textContent = info.versionName ? `v${info.versionName}` : '–';
    } catch (e) { /* ignore */ }

    $('update-check-btn').addEventListener('click', () => check(false));
    $('update-install-btn').addEventListener('click', () => {
      if (!latest) return;
      $('update-install-btn').disabled = true;
      setStatus('Starting download…');
      b.downloadAndInstall();
    });

    const pingBtn = $('devlog-test-btn');
    if (pingBtn) {
      pingBtn.addEventListener('click', () => {
        pingBtn.textContent = '⏳ Sending…';
        if (window.DevLog) {
          window.DevLog.log('PING_TEST', { manual: true, time: Date.now() });
          window.DevLog.flush();
        }
        setTimeout(() => {
          pingBtn.textContent = '✅ Sent!';
          setTimeout(() => { pingBtn.textContent = '📡 Send Test Ping'; }, 2000);
        }, 500);
      });
    }

    function openShareModal() {
      const modal = $('share-modal');
      if (modal) modal.style.display = 'flex';
    }

    function closeShareModal() {
      const modal = $('share-modal');
      if (modal) modal.style.display = 'none';
      const toast = $('share-copy-toast');
      if (toast) toast.style.display = 'none';
    }

    const shareBtn = $('share-apk-btn');
    if (shareBtn) shareBtn.addEventListener('click', openShareModal);

    const shareSidebarBtn = $('share-sidebar-btn');
    if (shareSidebarBtn) shareSidebarBtn.addEventListener('click', openShareModal);

    const closeShareBtn = $('close-share-modal-btn');
    if (closeShareBtn) closeShareBtn.addEventListener('click', closeShareModal);

    // Option 1: Gmail / Email
    const emailOpt = $('share-option-email');
    if (emailOpt) {
      emailOpt.addEventListener('click', () => {
        closeShareModal();
        const activeBridge = (window.AndroidUpdater && typeof window.AndroidUpdater.shareEmail === 'function')
          ? window.AndroidUpdater
          : null;

        const downloadUrl = (activeBridge && typeof activeBridge.getLatestDownloadUrl === 'function')
          ? activeBridge.getLatestDownloadUrl()
          : 'https://github.com/thundergeek/dyslexiquest-releases/releases/latest';

        if (activeBridge) {
          activeBridge.shareEmail(downloadUrl);
        } else {
          const subject = encodeURIComponent('Play DyslexiQuest - Interactive Reading Game!');
          const body = encodeURIComponent(
            'Hi!\n\nHere is DyslexiQuest, a fun reading and speech game for kids with 3D pets, quests, and mini-games!\n\nTap here to download and install on Android:\n' + downloadUrl + '\n\nEnjoy the quest!'
          );
          window.location.href = `mailto:?subject=${subject}&body=${body}`;
        }
      });
    }

    // Option 2: Send Raw APK File
    const fileOpt = $('share-option-file');
    if (fileOpt) {
      fileOpt.addEventListener('click', () => {
        closeShareModal();
        const activeBridge = (window.AndroidUpdater && typeof window.AndroidUpdater.shareApk === 'function')
          ? window.AndroidUpdater
          : null;

        if (activeBridge) {
          activeBridge.shareApk();
        } else if (navigator.share) {
          navigator.share({
            title: 'DyslexiQuest APK',
            text: 'Download DyslexiQuest Android app:',
            url: 'https://github.com/thundergeek/dyslexiquest-releases/releases/latest'
          }).catch(() => {});
        } else {
          window.open('https://github.com/thundergeek/dyslexiquest-releases/releases/latest', '_blank');
        }
      });
    }

    // Option 3: Copy Direct Link
    const copyOpt = $('share-option-copy');
    if (copyOpt) {
      copyOpt.addEventListener('click', () => {
        const activeBridge = (window.AndroidUpdater && typeof window.AndroidUpdater.getLatestDownloadUrl === 'function')
          ? window.AndroidUpdater
          : null;

        const downloadUrl = (activeBridge && typeof activeBridge.getLatestDownloadUrl === 'function')
          ? activeBridge.getLatestDownloadUrl()
          : 'https://github.com/thundergeek/dyslexiquest-releases/releases/latest';

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(downloadUrl).then(() => {
            const toast = $('share-copy-toast');
            if (toast) toast.style.display = 'block';
          }).catch(() => {
            prompt('Copy this download link:', downloadUrl);
          });
        } else {
          prompt('Copy this download link:', downloadUrl);
        }
      });
    }


    // When returning from Android's permission screen, continue the install.

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && waitingForPermission && b.canInstall()) {
        b.resumeInstall();
      }
    });

    // Quiet check shortly after launch so the badge appears if an update exists.
    setTimeout(() => check(true), 4000);
  }

  // The native bridge can attach slightly after page load; retry briefly.
  let tries = 0;
  (function waitForBridge() {
    if (bridge() || tries++ > 20) { init(); return; }
    setTimeout(waitForBridge, 250);
  })();
})();
