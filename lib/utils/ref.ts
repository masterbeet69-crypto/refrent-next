const REF_REGEX = /^REF-[A-Z]{2}-[A-Z]{3}-\d{5}$/;

export function isValidRefCode(code: string): boolean {
  return REF_REGEX.test(code);
}

export function parseRefCode(code: string) {
  if (!isValidRefCode(code)) return null;
  const parts = code.split('-');
  // REF - CC - CCC - NNNNN
  return {
    countryCode: parts[1],
    cityCode:    parts[2],
    number:      parseInt(parts[3], 10),
  };
}
