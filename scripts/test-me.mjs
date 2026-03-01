import https from 'https';

function request(opts, body = null) {
  return new Promise((resolve) => {
    const req = https.request(opts, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d, headers: res.headers }));
    });
    if (body) req.write(body);
    req.end();
  });
}

const loginBody = JSON.stringify({ email: 'user@refrent.test', password: 'User1234!' });
const login = await request({
  hostname: 'refrent-next.vercel.app',
  path: '/api/v1/auth/login', method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginBody) },
}, loginBody);

const cookies = (login.headers['set-cookie'] || []).map(c => c.split(';')[0]).join('; ');
console.log('Login:', login.status, login.body);

// Test /api/v1/auth/me (does same session check as requireUser)
const me = await request({
  hostname: 'refrent-next.vercel.app',
  path: '/api/v1/auth/me', method: 'GET',
  headers: { Cookie: cookies },
});
console.log('/api/v1/auth/me:', me.status, me.body.slice(0, 300));

// Test the health endpoint as reference
const health = await request({
  hostname: 'refrent-next.vercel.app',
  path: '/api/v1/health', method: 'GET',
  headers: { Cookie: cookies },
});
console.log('/api/v1/health:', health.status, health.body);
