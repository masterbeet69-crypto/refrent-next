import https from 'https';

function request(opts, body = null) {
  return new Promise((resolve) => {
    const req = https.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d, headers: res.headers }));
    });
    if (body) req.write(body);
    req.end();
  });
}

// 1. Login
const loginBody = JSON.stringify({ email: 'admin@refrent.test', password: 'Admin1234!' });
const login = await request({
  hostname: 'refrent-next.vercel.app',
  path: '/api/v1/auth/login',
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginBody) },
}, loginBody);

console.log('Login:', login.status, login.body);
const cookies = (login.headers['set-cookie'] || []).map(c => c.split(';')[0]).join('; ');
console.log('Cookies:', cookies);

// 2. Access admin dashboard
const dash = await request({
  hostname: 'refrent-next.vercel.app',
  path: '/admin/dashboard',
  method: 'GET',
  headers: { Cookie: cookies, Accept: 'text/html,*/*', 'User-Agent': 'Mozilla/5.0' },
});

console.log('Dashboard status:', dash.status);
if (dash.status !== 200) {
  console.log('Error body (first 800 chars):', dash.body.slice(0, 800));
} else {
  console.log('Dashboard OK -', dash.body.length, 'bytes');
}
