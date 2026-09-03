import { execSync } from 'node:child_process';
import { cpSync, mkdirSync, writeFileSync } from 'node:fs';

// 1. Run vinext build (produces dist/)
execSync('npx vinext build', { stdio: 'inherit' });

const out = '.vercel/output';

// 2. Create Build Output API structure
mkdirSync(`${out}/static`, { recursive: true });
mkdirSync(`${out}/functions/index.func`, { recursive: true });

// 3. Copy client assets to static/
cpSync('dist/client', `${out}/static`, { recursive: true });

// 4. Copy public assets to static/
try {
  cpSync('public', `${out}/static`, { recursive: true });
} catch {}

// 5. Copy server bundle into the function
cpSync('dist/server', `${out}/functions/index.func/dist/server`, {
  recursive: true,
});
cpSync('dist/client', `${out}/functions/index.func/dist/client`, {
  recursive: true,
});

// Copy other dist files needed by the server
for (const name of [
  'BUILD_ID',
  '__vite_rsc_assets_manifest.js',
  'vinext-client-assets.js',
  'vinext-externals.json',
  'vinext-server.json',
]) {
  try {
    cpSync(`dist/${name}`, `${out}/functions/index.func/dist/${name}`, {
      recursive: true,
    });
  } catch {}
}

// Copy the SSR bundle
try {
  cpSync('dist/ssr', `${out}/functions/index.func/dist/ssr`, {
    recursive: true,
  });
} catch {}

// Copy _next directory if it exists at dist root
try {
  cpSync('dist/_next', `${out}/functions/index.func/dist/_next`, {
    recursive: true,
  });
} catch {}

// 6. Mark function directory as ESM so .js imports work
writeFileSync(
  `${out}/functions/index.func/package.json`,
  JSON.stringify({ type: 'module' })
);

// 7. Create the function entry point that adapts fetch() to Node.js
writeFileSync(
  `${out}/functions/index.func/index.mjs`,
  `
import { createServer } from 'node:http';

let handler;

async function getHandler() {
  if (handler) return handler;
  const mod = await import('./dist/server/index.js');
  handler = mod.default;
  return handler;
}

export default async function (req, res) {
  const h = await getHandler();

  // Build the URL from the request
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
  const url = new URL(req.url, proto + '://' + host);

  // Read request body
  let body = null;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    if (chunks.length) body = Buffer.concat(chunks);
  }

  // Convert to Web Request
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

  // Call the vinext fetch handler
  const webRes = await h.fetch(webReq);

  // Send the Web Response back through Node.js
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
`
);

// 8. Function config
writeFileSync(
  `${out}/functions/index.func/.vc-config.json`,
  JSON.stringify(
    {
      runtime: 'nodejs22.x',
      handler: 'index.mjs',
      launcherType: 'Nodejs',
      maxDuration: 30,
      supportsResponseStreaming: true,
    },
    null,
    2
  )
);

// 9. Build Output API config — static assets served from CDN, everything else
//    falls through to the serverless function
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
    2
  )
);

console.log('Vercel Build Output API structure created.');
