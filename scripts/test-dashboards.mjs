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

async function loginAndTest(email, password, paths) {
  const loginBody = JSON.stringify({ email, password });
  const login = await request({
    hostname: 'refrent-next.vercel.app',
    path: '/api/v1/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginBody) },
  }, loginBody);
  const cookies = (login.headers['set-cookie'] || []).map(c => c.split(';')[0]).join('; ');

  for (const path of paths) {
    const r = await request({
      hostname: 'refrent-next.vercel.app',
      path,
      method: 'GET',
      headers: { Cookie: cookies, Accept: 'text/html,*/*' },
    });
    console.log(`[${email.split('@')[0]}] ${path} → ${r.status}`);
    if (r.status === 500) {
      // Extract error hint from the HTML
      const match = r.body.match(/digest[^"]*"([^"]+)"/i) || r.body.match(/Digest[:\s]+(\d+)/);
      if (match) console.log('  Digest:', match[1]);
    }
  }
}

await loginAndTest('admin@refrent.test', 'Admin1234!', [
  '/admin/dashboard',
]);

await loginAndTest('agent@refrent.test', 'Agent1234!', [
  '/agent/dashboard',
]);

await loginAndTest('user@refrent.test', 'User1234!', [
  '/user/dashboard',
]);
