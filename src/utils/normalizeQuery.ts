export function normalizeQuery(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[’']/g, '')
    .replace(/\bopen[- ]source\b/g, 'open code')
    .replace(/\s+/g, ' ')
    .trim()
}
