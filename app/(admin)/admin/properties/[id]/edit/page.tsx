import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import { AdminPropertyEditForm } from './AdminPropertyEditForm';
import { ArrowLeft } from 'lucide-react';

interface Props { params: Promise<{ id: string }> }

export default async function AdminPropertyEditPage({ params }: Props) {
  const { id } = await params;

  const sb = createServerSupabase();
  const { data: property } = await sb
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (!property) return notFound();

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/properties"
        className="inline-flex items-center gap-2 text-sm mb-6 transition-opacity hover:opacity-70"
        style={{ color: '#2A5C45' }}
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux propriétés
      </Link>

      <h1 className="text-2xl mb-8" style={{ fontFamily: 'var(--font-fraunces)', color: '#1A1714' }}>
        Modifier — <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem' }}>{property.ref_code}</span>
      </h1>

      <AdminPropertyEditForm property={property} />
    </div>
  );
}
