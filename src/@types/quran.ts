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
