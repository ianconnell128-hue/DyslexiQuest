/**
 * DyslexiQuest DevLog Client
 * Sends diagnostics to local DevLog server running on tom-iMac (192.168.1.221:8787).
 * Strictly diagnostic: no audio streams, no personal player names, no coordinates.
 */
(function() {
  'use strict';

  const DEFAULT_HOST = 'http://192.168.1.221:8787';
  let serverUrl = localStorage.getItem('dq_devlog_url') || DEFAULT_HOST;
  let enabled = localStorage.getItem('dq_devlog_enabled') !== 'false'; // default true
  let queue = [];
  let isSending = false;
  let deviceInfo = null;

  function getDeviceInfo() {
    if (deviceInfo) return deviceInfo;
    let model = 'WebBrowser';
    let androidVer = '';
    const ua = navigator.userAgent;
    const match = ua.match(/Android\s([0-9\.]+);?\s?([^;\)]+)?/);
    if (match) {
      androidVer = match[1] || '';
      model = (match[2] || 'Android').trim();
    }
    deviceInfo = {
      model: model,
      androidVersion: androidVer,
      userAgent: ua.slice(0, 120)
    };
    return deviceInfo;
  }

  function queueLog(tag, level, message) {
    if (!enabled) return;
    const entry = {
      timestamp: new Date().toISOString(),
      device: getDeviceInfo(),
      tag: tag || 'APP',
      level: level || 'INFO',
      message: message
    };
    queue.push(entry);
    if (queue.length > 200) {
      queue.shift(); // drop oldest if disconnected for too long
    }
    if (level === 'ERROR' || tag === 'SPEECH_RESULT' || queue.length >= 10) {
      flush();
    }
  }

  async function flush() {
    if (isSending || queue.length === 0 || !enabled) return;
    isSending = true;
    const batch = queue.slice(0, 50);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`${serverUrl}/api/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batch),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        queue = queue.slice(batch.length);
      }
    } catch (e) {
      // Server down or offline, keep in queue
    } finally {
      isSending = false;
    }
  }

  setInterval(flush, 3000);

  // Expose global DevLog API
  window.DevLog = {
    log: (tag, msg) => queueLog(tag, 'INFO', msg),
    warn: (tag, msg) => queueLog(tag, 'WARN', msg),
    error: (tag, msg) => queueLog(tag, 'ERROR', msg),
    flush: flush,
    setEnabled: (val) => {
      enabled = Boolean(val);
      localStorage.setItem('dq_devlog_enabled', enabled ? 'true' : 'false');
    },
    isEnabled: () => enabled,
    setUrl: (url) => {
      serverUrl = url;
      localStorage.setItem('dq_devlog_url', url);
    },
    getUrl: () => serverUrl
  };

  // Capture unhandled JS errors
  window.addEventListener('error', (e) => {
    queueLog('JS_ERROR', 'ERROR', {
      message: e.message,
      filename: e.filename,
      lineno: e.lineno,
      colno: e.colno
    });
  });

  window.addEventListener('unhandledrejection', (e) => {
    queueLog('PROMISE_ERROR', 'ERROR', {
      reason: String(e.reason && e.reason.stack ? e.reason.stack : e.reason)
    });
  });

  console.log('[DevLog] Client initialized, target:', serverUrl);
})();
