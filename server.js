const path = require('path');

// 1. Force production environment
process.env.NODE_ENV = 'production';

// 2. Resolve port and host:
// Render dynamically provides PORT (usually 10000).
// Crucial: Must bind to 0.0.0.0 (NOT container hostname) so Render's proxy can route traffic.
const port = parseInt(process.env.PORT, 10) || 3000;
const hostname = '0.0.0.0';

// Force environment variables for child modules
process.env.PORT = String(port);
process.env.HOSTNAME = hostname;

console.log(`[MSOL Server Boot] Starting server on ${hostname}:${port}...`);

// 3. Delegate directly to Next.js standalone runner
try {
  require('./.next/standalone/server.js');
} catch (err) {
  console.error('[MSOL Server Boot] Failed to start standalone server:', err);
  process.exit(1);
}
