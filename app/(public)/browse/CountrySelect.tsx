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
      className="px-3 py-2 rounded-lg outline-none text-sm"
      style={{ border: '1px solid #E8E4DF', backgroundColor: '#FFFFFF', color: '#1A1714' }}
    >
      <option value="">Tous les pays</option>
      {Object.entries(AFRICA_REGIONS).map(([cc, r]) => (
        <option key={cc} value={cc}>{r.name}</option>
      ))}
    </select>
  );
}
