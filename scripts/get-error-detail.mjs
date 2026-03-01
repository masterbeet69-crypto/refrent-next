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

const loginBody = JSON.stringify({ email: 'user@refrent.test', password: 'User1234!' });
const login = await request({
  hostname: 'refrent-next.vercel.app',
  path: '/api/v1/auth/login', method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginBody) },
}, loginBody);

const cookies = (login.headers['set-cookie'] || []).map(c => c.split(';')[0]).join('; ');

// Try RSC (React Server Component) fetch directly - this shows more error detail
const rsc = await request({
  hostname: 'refrent-next.vercel.app',
  path: '/user/dashboard',
  method: 'GET',
  headers: {
    Cookie: cookies,
    Accept: 'text/x-component',  // RSC fetch
    'Next-Router-State-Tree': encodeURIComponent(JSON.stringify([["",{"children":["(user)",{"children":["user",{"children":["dashboard",{"children":["__PAGE__",{}]}]}]}]}],null])),
  },
});

console.log('RSC status:', rsc.status);
// Look for error messages
const body = rsc.body;
const errMatch = body.match(/Error[:\s]+([^\n"]{0,200})/g);
if (errMatch) {
  errMatch.forEach(e => console.log('Error found:', e.slice(0, 200)));
} else {
  console.log('Body sample:', body.slice(0, 500));
}
