#!/usr/bin/env node
// Minimal proxy to forward browser waitlist POSTs to your Supabase function
// Usage: set WAITLIST_TARGET and SERVICE_ROLE env vars, then run `node server.js`

const http = require('http');
const { URL } = require('url');

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const TARGET = process.env.WAITLIST_TARGET || process.env.VITE_WAITLIST_ENDPOINT;
const SERVICE_ROLE = process.env.SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

if (!TARGET || !SERVICE_ROLE) {
  console.error('Missing WAITLIST_TARGET and/or SERVICE_ROLE environment variables.');
  console.error('Example:');
  console.error('  $env:WAITLIST_TARGET = "https://<project>.functions.supabase.co/waitlistc"');
  console.error('  $env:SERVICE_ROLE = "<service_role_key>"');
  console.error('  node server.js');
  process.exit(1);
}

function sendJSON(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  if (req.method !== 'POST' || req.url !== '/waitlist') {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
    return;
  }

  // Collect body
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString();
  const contentType = (req.headers['content-type'] || '').toLowerCase();

  let forwardBody = raw;
  let forwardHeaders = { 'Authorization': `Bearer ${SERVICE_ROLE}`, 'Accept': 'application/json' };
  if (contentType.includes('application/json')) {
    forwardHeaders['Content-Type'] = 'application/json';
  } else if (contentType.includes('application/x-www-form-urlencoded')) {
    forwardHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
  } else {
    // default to json if body looks like json
    try { JSON.parse(raw); forwardHeaders['Content-Type'] = 'application/json'; } catch(e) { forwardHeaders['Content-Type'] = 'text/plain'; }
  }

  try {
    const resp = await fetch(TARGET, {
      method: 'POST',
      headers: forwardHeaders,
      body: forwardBody
    });
    const text = await resp.text();
    // Relay status and body
    res.writeHead(resp.status, {
      'Content-Type': resp.headers.get('content-type') || 'text/plain',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(text);
  } catch (err) {
    console.error('Proxy request failed:', err);
    sendJSON(res, 500, { error: 'Proxy error', details: String(err) });
  }
});

server.listen(PORT, () => {
  console.log(`Waitlist proxy listening on http://localhost:${PORT}/waitlist`);
  console.log(`Forwarding to: ${TARGET}`);
});
