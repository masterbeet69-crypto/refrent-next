// New format: REFERENT-{CC}-{CITY}-{NUM}  e.g. REFERENT-BJ-CTN-00001
// Backward compat: REF-{anything}         e.g. REF-5530 (existing DB codes)
const REFERENT_REGEX = /^REFERENT-[A-Z]{2}-[A-Z]{2,5}-\d+$/;
const REF_LEGACY_REGEX = /^REF-[A-Z0-9-]{1,30}$/;

export function isValidRefCode(code: string): boolean {
  return REFERENT_REGEX.test(code) || REF_LEGACY_REGEX.test(code);
}

export function parseRefCode(code: string) {
  if (!isValidRefCode(code)) return null;
  const parts = code.split('-');
  if (code.startsWith('REFERENT-')) {
    // REFERENT - CC - CITY - NUM
    return {
      countryCode: parts[1],
      cityCode:    parts[2],
      number:      parseInt(parts[3], 10),
    };
  }
  // Legacy REF-XX-XXX-NNNNN or REF-NNNN
  return {
    countryCode: parts[1] ?? null,
    cityCode:    parts[2] ?? null,
    number:      parseInt(parts[parts.length - 1], 10),
  };
}

/**
 * Auto-format a raw string into REFERENT-CC-CITY-NUM as the user types.
 * Strips non-alphanumeric chars and inserts dashes in the right positions.
 */
export function autoFormatRefCode(raw: string): string {
  // Keep only letters and digits, uppercase
  const clean = raw.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  if (!clean) return '';

  // Detect legacy "REF" prefix (not REFERENT)
  if (clean.startsWith('REF') && !clean.startsWith('REFERENT')) {
    const body = clean.slice(3);
    if (!body) return 'REF';
    // Legacy: REF-{body} — simple dash after REF
    return `REF-${body}`;
  }

  // REFERENT prefix (new format)
  const prefix = 'REFERENT';
  if (!clean.startsWith(prefix)) {
    // Still being typed — show as-is until REFERENT is complete
    return clean.slice(0, 8);
  }

  const body = clean.slice(8); // after REFERENT
  if (!body) return prefix;

  // Country code: exactly 2 letters
  const cc = body.slice(0, 2);
  const rest = body.slice(2);
  if (!rest) return `${prefix}-${cc}`;

  // City code: letters (up to 5), then numbers
  const cityMatch = rest.match(/^([A-Z]{1,5})/);
  const cityCode = cityMatch?.[1] ?? '';
  const numPart  = rest.slice(cityCode.length);

  if (!cityCode) return `${prefix}-${cc}-${rest}`;
  if (!numPart)  return `${prefix}-${cc}-${cityCode}`;
  return `${prefix}-${cc}-${cityCode}-${numPart}`;
}
