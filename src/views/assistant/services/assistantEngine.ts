import type { AssistantCitationLink } from '@/@types/quran'
import { DUA_HADITH_CATALOG } from '@/data/duaHadithCatalog'
import { fetchAyahByReference, searchQuranByKeyword } from '@/services/quranApi'
import { normalizeQuery } from '@/utils/normalizeQuery'

export interface AssistantReply {
  text: string
  arabic?: string
  reference?: string
  links?: AssistantCitationLink[]
}

const STOP_WORDS = new Set([
  'what',
  'does',
  'the',
  'quran',
  'qur',
  'islam',
  'islamic',
  'hadith',
  'about',
  'teach',
  'mean',
  'meaning',
  'verse',
  'ayah',
  'surah',
  'show',
  'find',
  'give',
  'tell',
  'more',
  'please',
  'with',
  'from',
  'have',
  'that',
  'this',
  'can',
  'you',
  'how',
  'dua',
  'for',
  'and',
])

const SURAH_SHORTCUTS: Array<{ match: RegExp; ref: string; title: string }> = [
  { match: /ayat\s*(?:al-?)?kursi|2[:.]255/, ref: '2:255', title: 'Ayat al-Kursi (2:255)' },
  { match: /fatiha|opening/, ref: '1:1', title: 'Surah Al-Fatihah (1:1)' },
  { match: /muzzammil|73[:.]4/, ref: '73:4', title: 'Surah Al-Muzzammil (73:4)' },
  { match: /ikhlas|sincerity|112/, ref: '112:1', title: 'Surah Al-Ikhlas (112:1)' },
  { match: /inshirah|sharh|94[:.][56]/, ref: '94:5', title: 'Surah Ash-Sharh (94:5)' },
]

export async function resolveAssistantQuery(rawInput: string): Promise<AssistantReply> {
  const normalized = normalizeQuery(rawInput)

  if (/^(salaam|salam|assalamu|\bhi\b|\bhello\b)/.test(normalized)) {
    return {
      text: 'Wa alaikum assalam. Ask for any Surah or ayah reference (like 2:255 or 73:4), a topic in the Qur’an (mercy, patience, gratitude), or an authentic dua and hadith.',
      links: [
        { label: 'Read Qur’an', to: '/read' },
        { label: 'Dua & Hadith', to: '/dua-hadith' },
      ],
    }
  }

  if (/fatwa|halal|haram|permissib|ruling|divorce|inheritance|zakat amount/.test(normalized)) {
    return {
      text: 'I look up verified Qur’anic verses and cited Hadith/Dua texts rather than issuing religious rulings (fatwa). For personal fiqh or legal rulings, please consult a qualified scholar or local imam.',
      links: [{ label: 'Explore Dua & Hadith', to: '/dua-hadith' }],
    }
  }

  // Direct Ayah reference pattern e.g. 2:255 or named shortcut
  const numericRef = rawInput.match(/\b(\d{1,3}:\d{1,3})\b/)?.[1]
  const shortcut = SURAH_SHORTCUTS.find((s) => s.match.test(normalized))
  const targetRef = numericRef || shortcut?.ref

  if (targetRef) {
    try {
      const ayah = await fetchAyahByReference(targetRef, 'en.sahih')
      return {
        text: `“${ayah.translation}”`,
        arabic: ayah.arabic,
        reference: `Surah ${ayah.surahName} · ${ayah.surahNumber}:${ayah.numberInSurah} (Saheeh International)`,
        links: [
          { label: `Read Surah ${ayah.surahName}`, to: `/read?surah=${ayah.surahNumber}` },
          { label: 'Open Translation View', to: `/translation?surah=${ayah.surahNumber}` },
        ],
      }
    } catch {
      return {
        text: `I could not fetch ayah ${targetRef} right now. You can browse it directly inside the Qur’an Reader.`,
        links: [{ label: 'Open Qur’an Reader', to: `/read?surah=${targetRef.split(':')[0]}` }],
      }
    }
  }

  // Match authentic Dua & Hadith catalog
  const duaMatch = DUA_HADITH_CATALOG.find(
    (item) =>
      normalized.includes(item.topic.toLowerCase()) ||
      normalized.includes(item.title.toLowerCase()) ||
      (/dua|supplicat|knowledge|forgiveness|pardon|heart|intention|kindness|gentleness|patience|gratitude/.test(
        normalized,
      ) &&
        (item.title.toLowerCase().split(/\s+/).some((w) => w.length > 4 && normalized.includes(w)) ||
          item.translation.toLowerCase().split(/\s+/).some((w) => w.length > 4 && normalized.includes(w)))),
  )

  if (duaMatch) {
    return {
      text: `${duaMatch.title}: ${duaMatch.translation}`,
      arabic: duaMatch.arabic,
      reference: `${duaMatch.source} · ${duaMatch.authenticity}`,
      links: [{ label: 'Open Dua & Hadith Library', to: '/dua-hadith' }],
    }
  }

  if (/hifz|memoriz|review|revise/.test(normalized)) {
    return {
      text: 'For steady hifz, try reading slowly with translation first, repeating one short passage in loops of 3, and revisiting earlier verses at +3 and +7 day intervals. Start in our distraction-free Reader:',
      links: [
        { label: 'Read Qur’an', to: '/read?surah=94' },
        { label: 'Back to Home Hifz Preview', to: '/#memorize' },
      ],
    }
  }

  // Extract meaningful search keyword for live Al-Quran Cloud lookup
  const words = normalized
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w))
  const keyword = words[0]

  if (keyword) {
    try {
      const { count, matches } = await searchQuranByKeyword(keyword, 'en.sahih')
      if (matches.length > 0) {
        const top = matches.slice(0, 3)
        const summary = top
          .map((m) => `• ${m.surahEnglishName} (${m.surahNumber}:${m.numberInSurah}): “${m.text}”`)
          .join('\n')
        return {
          text: `Found ${count} mentions related to “${keyword}” in Saheeh International. Here are ${top.length} verses:\n\n${summary}`,
          links: [
            { label: `Open ${top[0].surahEnglishName}`, to: `/translation?surah=${top[0].surahNumber}` },
            { label: 'Explore Translation Search', to: '/translation' },
          ],
        }
      }
    } catch {
      /* Fallback gracefully below */
    }
  }

  return {
    text: 'I can look up specific Qur’an verses (try "2:255" or "73:4"), search themes across translations (try "mercy", "patience", "light"), or retrieve authentic Duas and Hadith.',
    links: [
      { label: 'Read Qur’an', to: '/read' },
      { label: 'Explore Translation', to: '/translation' },
      { label: 'Dua & Hadith', to: '/dua-hadith' },
    ],
  }
}
