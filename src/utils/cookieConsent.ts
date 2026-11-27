export type CookieConsentLevel = 'all' | 'essential'

export interface CookieConsentRecord {
  level: CookieConsentLevel
  updatedAt: string
}

export const COOKIE_CONSENT_STORAGE_KEY = 'qb_cookie_consent_v1'
export const COOKIE_CONSENT_EVENT = 'qb:cookie-consent-changed'

export function getCookieConsent(): CookieConsentRecord | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<CookieConsentRecord>
    if (parsed.level === 'all' || parsed.level === 'essential') {
      return {
        level: parsed.level,
        updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : '',
      }
    }
  } catch {
    // Ignore storage read errors in restricted contexts.
  }
  return null
}

export function setCookieConsent(level: CookieConsentLevel): CookieConsentRecord {
  const record: CookieConsentRecord = {
    level,
    updatedAt: new Date().toISOString(),
  }

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(record))
    } catch {
      // Ignore storage write errors in private/restricted browsing.
    }
    try {
      const maxAgeSeconds = 60 * 60 * 24 * 365
      document.cookie = `qb_consent=${level}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`
    } catch {
      // Ignore cookie write errors.
    }
    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: record }))
  }

  return record
}
