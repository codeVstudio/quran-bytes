export type RecitationSpeed = 1 | 0.75 | 1.25

export type ContributeSkill =
  | 'development'
  | 'design'
  | 'translation'
  | 'education'
  | 'content-review'

export interface VerseExcerpt {
  surahName: string
  reference: string
  arabic: string
  ayahNumberArabic: string
  translation: string
  translator: string
}

export interface DailyPracticeItem {
  id: 'dua' | 'hadith'
  tabLabel: string
  kicker: string
  arabic: string
  translation: string
  source: string
}

export interface VisionPrinciple {
  number: string
  title: string
  description: string
}

export interface HelpMessage {
  id: string
  fromGuide: boolean
  text: string
  welcomeNote?: string
  link?: [label: string, href: string]
}

export interface HelpAnswerRule {
  id: string
  match: RegExp
  text: string
  link?: [label: string, href: string]
}

export interface SurahMeta {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: 'Meccan' | 'Medinan' | string
}

export interface MergedAyah {
  number: number
  numberInSurah: number
  arabic: string
  translation?: string
  juz?: number
  page?: number
  audio?: string
}

export interface SurahWithTranslation {
  meta: SurahMeta
  editionId: string
  editionName: string
  ayahs: MergedAyah[]
  isFallback?: boolean
}

export interface TranslationEditionOption {
  id: string
  label: string
  language: string
  translator: string
}

export interface QuranSearchHit {
  surahNumber: number
  surahEnglishName: string
  numberInSurah: number
  text: string
}

export type DuaHadithCategory = 'dua' | 'hadith'

export type DuaHadithTopic =
  | 'Knowledge'
  | 'Patience'
  | 'Gratitude'
  | 'Forgiveness'
  | 'Daily Remembrance'
  | 'Character'

export interface DuaHadithEntry {
  id: string
  category: DuaHadithCategory
  topic: DuaHadithTopic
  title: string
  arabic: string
  transliteration: string
  translation: string
  source: string
  authenticity: string
}

export interface AssistantCitationLink {
  label: string
  to: string
}

export interface AssistantMessage {
  id: string
  role: 'assistant' | 'user'
  text: string
  arabic?: string
  reference?: string
  links?: AssistantCitationLink[]
}
