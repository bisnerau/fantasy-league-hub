import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';

execSync('npx vinext build', { stdio: 'inherit' });

const out = '.vercel/output';
const func = `${out}/functions/index.func`;

mkdirSync(`${out}/static`, { recursive: true });
mkdirSync(func, { recursive: true });

// Static assets served from the CDN edge
cpSync('dist/standalone/dist/client', `${out}/static`, { recursive: true });
if (existsSync('public')) {
  cpSync('public', `${out}/static`, { recursive: true });
}

// Copy the entire standalone build into the function (includes node_modules)
cpSync('dist/standalone', func, { recursive: true });

// Vercel function entry — adapts Node.js (req, res) to the vinext fetch handler
writeFileSync(
  `${func}/index.mjs`,
  `import { join } from 'node:path';

const __dir = import.meta.dirname;
const serverEntry = join(__dir, 'dist', 'server', 'index.js');

let handler;

async function getHandler() {
  if (handler) return handler;
  const mod = await import(serverEntry);
  handler = mod.default;
  return handler;
}

export default async function (req, res) {
  const h = await getHandler();

  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
  const url = new URL(req.url, proto + '://' + host);

  let body = null;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    if (chunks.length) body = Buffer.concat(chunks);
  }

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value == null) continue;
    if (Array.isArray(value)) {
      for (const v of value) headers.append(key, v);
    } else {
      headers.set(key, value);
    }
  }

  const webReq = new Request(url.href, {
    method: req.method,
    headers,
    body,
    duplex: body ? 'half' : undefined,
  });

  const webRes = await h.fetch(webReq);

  const resHeaders = {};
  for (const [key, value] of webRes.headers.entries()) {
    if (key === 'set-cookie') {
      resHeaders[key] = webRes.headers.getSetCookie();
    } else {
      resHeaders[key] = value;
    }
  }

  res.writeHead(webRes.status, resHeaders);

  if (webRes.body) {
    const reader = webRes.body.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    } finally {
      reader.releaseLock();
    }
  }

  res.end();
}
`,
);

writeFileSync(
  `${func}/.vc-config.json`,
  JSON.stringify(
    {
      runtime: 'nodejs22.x',
      handler: 'index.mjs',
      launcherType: 'Nodejs',
      maxDuration: 30,
      supportsResponseStreaming: true,
    },
    null,
    2,
  ),
);

writeFileSync(
  `${out}/config.json`,
  JSON.stringify(
    {
      version: 3,
      routes: [
        {
          src: '/favicon.svg',
          headers: { 'Cache-Control': 'public, max-age=3600' },
        },
        {
          src: '/_next/static/(.*)',
          headers: {
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        },
        { handle: 'filesystem' },
        { src: '/(.*)', dest: '/index' },
      ],
    },
    null,
    2,
  ),
);

console.log('Vercel Build Output API structure created.');
