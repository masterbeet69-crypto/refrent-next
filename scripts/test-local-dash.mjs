import http from 'http';

function request(opts, body = null) {
  return new Promise((resolve) => {
    const req = http.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d, headers: res.headers }));
    });
    if (body) req.write(body);
    req.end();
  });
}

const loginBody = JSON.stringify({ email: 'user@refrent.test', password: 'User1234!' });
const login = await request({
  hostname: 'localhost', port: 3000,
  path: '/api/v1/auth/login', method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginBody) },
}, loginBody);

const cookies = (login.headers['set-cookie'] || []).map(c => c.split(';')[0]).join('; ');
console.log('Login:', login.status);

const dash = await request({
  hostname: 'localhost', port: 3000,
  path: '/user/dashboard', method: 'GET',
  headers: { Cookie: cookies, Accept: 'text/html,*/*' },
});

console.log('User dashboard:', dash.status);
if (dash.status !== 200) {
  // Extract meaningful error text
  const text = dash.body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log('Error:', text.slice(0, 1000));
}
