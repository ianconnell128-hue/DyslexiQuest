/**
 * DyslexiQuest Local DevLog Server
 * Runs on tom-iMac (port 8787). Accepts debug logs from the app over local Wi-Fi.
 * No external dependencies required (uses built-in Node.js modules).
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8787;
const LOG_DIR = path.resolve(__dirname, '..', 'devlogs');

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function getLogFileName(deviceId) {
  const date = new Date().toISOString().slice(0, 10);
  const safeDevice = (deviceId || 'unknown').replace(/[^a-zA-Z0-9_-]/g, '_');
  return path.join(LOG_DIR, `${date}_${safeDevice}.log`);
}

function appendLog(entry) {
  const ts = entry.timestamp || new Date().toISOString();
  const device = entry.device || {};
  const deviceId = device.model || device.id || 'unknown';
  const tag = entry.tag || 'APP';
  const level = (entry.level || 'INFO').toUpperCase();
  const message = typeof entry.message === 'object' ? JSON.stringify(entry.message) : entry.message;
  
  const line = `[${ts}] [${level}] [${tag}] [${deviceId}] ${message}\n`;
  
  // Write to device-specific log
  const targetFile = getLogFileName(deviceId);
  fs.appendFileSync(targetFile, line, 'utf8');

  // Also write to combined daily log
  const combinedFile = path.join(LOG_DIR, `${ts.slice(0, 10)}_combined.log`);
  fs.appendFileSync(combinedFile, line, 'utf8');

  // Print to console
  process.stdout.write(line);
}

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-DevLog-Key');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'GET' && url.pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, server: 'DyslexiQuest DevLog', time: new Date().toISOString() }));
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/log') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 2 * 1024 * 1024) { // 2MB safety limit
        res.writeHead(413, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Payload too large' }));
        req.destroy();
      }
    });

    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        if (Array.isArray(parsed)) {
          parsed.forEach(appendLog);
        } else {
          appendLog(parsed);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, received: Array.isArray(parsed) ? parsed.length : 1 }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON', detail: err.message }));
      }
    });
    return;
  }

  // Simple web viewer for recent logs
  if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/logs')) {
    const today = new Date().toISOString().slice(0, 10);
    const combinedFile = path.join(LOG_DIR, `${today}_combined.log`);
    let content = 'No logs yet for today.';
    if (fs.existsSync(combinedFile)) {
      const all = fs.readFileSync(combinedFile, 'utf8').trim().split('\n');
      content = all.slice(-100).join('\n');
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!DOCTYPE html>
<html>
<head>
  <title>DyslexiQuest DevLogs (${today})</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: monospace; background: #0f172a; color: #f8fafc; padding: 20px; margin: 0; }
    h1 { color: #38bdf8; font-size: 1.2rem; }
    pre { background: #1e293b; padding: 15px; border-radius: 8px; overflow-x: auto; white-space: pre-wrap; font-size: 12px; line-height: 1.5; }
    .refresh { background: #38bdf8; color: #0f172a; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer; }
  </style>
</head>
<body>
  <div style="display:flex; justify-content:space-between; align-items:center;">
    <h1>📱 DyslexiQuest Live DevLogs (${today})</h1>
    <button class="refresh" onclick="location.reload()">Refresh</button>
  </div>
  <pre>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body>
</html>`);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[DevLog] Server running on http://0.0.0.0:${PORT} (logs stored in ${LOG_DIR})`);
});
