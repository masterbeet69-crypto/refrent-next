import { requireUser } from '@/lib/auth/session';
import { UserProfileForm } from './UserProfileForm';

export default async function UserProfilePage() {
  const profile = await requireUser();

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-2xl" style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}>
        Mon profil
      </h1>
      <UserProfileForm profile={profile} />
    </div>
  );
}
