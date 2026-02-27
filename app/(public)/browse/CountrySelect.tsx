'use client';
import { AFRICA_REGIONS } from '@/lib/utils/country';

interface Props {
  defaultValue?: string;
  currentParams: Record<string, string>;
}

export function CountrySelect({ defaultValue = '', currentParams }: Props) {
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const u = new URLSearchParams(currentParams);
    if (e.target.value) {
      u.set('country', e.target.value);
    } else {
      u.delete('country');
    }
    // Also clear city when country changes
    u.delete('city');
    window.location.search = u.toString();
  }

  return (
    <select
      defaultValue={defaultValue}
      onChange={handleChange}
      className="px-3 py-2 rounded-r2 border border-brd bg-surf text-sm text-ink focus:outline-none focus:border-acc"
    >
      <option value="">Tous les pays</option>
      {Object.entries(AFRICA_REGIONS).map(([cc, r]) => (
        <option key={cc} value={cc}>{r.name}</option>
      ))}
    </select>
  );
}
