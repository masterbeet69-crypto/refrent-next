/**
 * Crée 3 comptes de test dans Supabase : admin, agent, user.
 * Exécuter avec: node scripts/create-test-accounts.mjs
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ofixrazipcbywhhqxbxb.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9maXhyYXppcGNieXdoaHF4YnhiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjA0NzA3NywiZXhwIjoyMDg3NjIzMDc3fQ.h_3Z8FpCaN7d0rardFTurqPIIcU9CtfXEeUMaYXwsQ8';

const sb = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const accounts = [
  {
    email: 'admin@refrent.test',
    password: 'Admin1234!',
    role: 'admin',
    full_name: 'Admin Refrent',
    country_code: 'BJ',
    city_code: 'CTN',
  },
  {
    email: 'agent@refrent.test',
    password: 'Agent1234!',
    role: 'agent',
    full_name: 'Agent Demo',
    country_code: 'SN',
    city_code: 'DKR',
  },
  {
    email: 'user@refrent.test',
    password: 'User1234!',
    role: 'user',
    full_name: 'Utilisateur Test',
    country_code: 'CI',
    city_code: 'ABJ',
  },
];

async function getOrCreateUser(email, password, metadata) {
  // Essayer de créer
  const { data: created, error: createErr } = await sb.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: metadata,
  });

  if (!createErr) return created.user.id;

  // Utilisateur déjà existant → trouver son ID
  const isExisting = createErr.message?.includes('already') || createErr.code === 'email_exists';
  if (isExisting) {
    const { data: list, error: listErr } = await sb.auth.admin.listUsers({ perPage: 500 });
    if (listErr) throw new Error(`Impossible de lister les utilisateurs: ${listErr.message}`);
    const existing = list.users.find(u => u.email === email);
    if (!existing) throw new Error(`Utilisateur introuvable après existence signalée`);

    // Mettre à jour le mot de passe et les métadonnées
    await sb.auth.admin.updateUserById(existing.id, {
      password,
      user_metadata: metadata,
      email_confirm: true,
    });
    console.log(`  → déjà existant, mis à jour`);
    return existing.id;
  }

  throw new Error(createErr.message);
}

for (const account of accounts) {
  const { email, password, role, full_name, country_code, city_code } = account;
  console.log(`\n[${role.toUpperCase()}] ${email}`);

  let userId;
  try {
    userId = await getOrCreateUser(email, password, { role, full_name, country_code, city_code });
    console.log(`  ✓ Auth user OK (${userId})`);
  } catch (e) {
    console.error(`  ✗ Auth: ${e.message}`);
    continue;
  }

  // Upsert profil
  const { error: profileErr } = await sb
    .from('profiles')
    .upsert({
      id: userId,
      role,
      full_name,
      country_code,
      city_code,
      is_active: true,
    }, { onConflict: 'id' });

  if (profileErr) {
    if (profileErr.message.includes("schema cache") || profileErr.message.includes("not found")) {
      console.error(`  ✗ Table 'profiles' introuvable.`);
      console.error(`    → Exécutez d'abord docs/migrations/001_profiles.sql dans le SQL Editor Supabase.`);
    } else {
      console.error(`  ✗ Profil: ${profileErr.message}`);
    }
  } else {
    console.log(`  ✓ Profil "${role}" créé`);
  }
}

console.log('\n─────────────────────────────────────────');
console.log('Comptes de test Refrent:');
console.log('─────────────────────────────────────────');
for (const { email, password, role } of accounts) {
  console.log(`  [${role.padEnd(5)}]  ${email.padEnd(28)}  ${password}`);
}
console.log('─────────────────────────────────────────');
