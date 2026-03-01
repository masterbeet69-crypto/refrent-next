const url = 'https://ofixrazipcbywhhqxbxb.supabase.co/rest/v1/';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9maXhyYXppcGNieXdoaHF4YnhiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjA0NzA3NywiZXhwIjoyMDg3NjIzMDc3fQ.h_3Z8FpCaN7d0rardFTurqPIIcU9CtfXEeUMaYXwsQ8';

const res = await fetch(url, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
const d = await res.json();
const tables = Object.keys(d.paths).filter(k => k !== '/' && !k.startsWith('/rpc/')).map(k => k.slice(1));
console.log('Tables:', tables.sort().join(', '));
