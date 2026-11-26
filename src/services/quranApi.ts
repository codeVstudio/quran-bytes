import axios from 'axios'
import type { MergedAyah, QuranSearchHit, SurahMeta, SurahWithTranslation } from '@/@types/quran'
import appConfig from '@/configs/app.config'
import { FALLBACK_SURAHS, FALLBACK_SURAH_LIST, TRANSLATION_EDITIONS } from '@/data/quranFallback'

const quranClient = axios.create({
  baseURL: appConfig.quranApiBaseUrl,
  timeout: 12000,
})

let cachedSurahList: SurahMeta[] | null = null
const cachedSurahs = new Map<string, SurahWithTranslation>()
const cachedAudio = new Map<number, string[]>()

interface RawAyahResponse {
  number: number
  numberInSurah: number
  text: string
  juz?: number
  page?: number
  audio?: string
}

interface RawEditionResponse {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: string
  ayahs: RawAyahResponse[]
  edition?: {
    identifier: string
    name: string
  }
}

export async function fetchAllSurahs(): Promise<{ surahs: SurahMeta[]; isFallback: boolean }> {
  if (cachedSurahList) {
    return { surahs: cachedSurahList, isFallback: false }
  }
  try {
    const { data } = await quranClient.get<{ data: SurahMeta[] }>('/surah')
    if (Array.isArray(data.data) && data.data.length > 0) {
      cachedSurahList = data.data
      return { surahs: data.data, isFallback: false }
    }
    throw new Error('Unexpected empty surah directory.')
  } catch {
    return { surahs: FALLBACK_SURAH_LIST, isFallback: true }
  }
}

export async function fetchSurahContent(
  surahNumber: number,
  editionId = 'en.sahih',
): Promise<SurahWithTranslation> {
  const key = `${surahNumber}:${editionId}`
  const existing = cachedSurahs.get(key)
  if (existing) return existing

  try {
    const { data } = await quranClient.get<{ data: RawEditionResponse[] }>(
      `/surah/${surahNumber}/editions/quran-uthmani,${editionId}`,
    )

    const [arabicEdition, translationEdition] = data.data
    if (!arabicEdition?.ayahs?.length) {
      throw new Error('Could not load Surah text.')
    }

    const ayahs: MergedAyah[] = arabicEdition.ayahs.map((ayah, index) => ({
      number: ayah.number,
      numberInSurah: ayah.numberInSurah,
      arabic: ayah.text,
      translation: translationEdition?.ayahs[index]?.text,
      juz: ayah.juz,
      page: ayah.page,
    }))

    const editionMeta = TRANSLATION_EDITIONS.find((item) => item.id === editionId)
    const result: SurahWithTranslation = {
      meta: {
        number: arabicEdition.number,
        name: arabicEdition.name,
        englishName: arabicEdition.englishName,
        englishNameTranslation: arabicEdition.englishNameTranslation,
        numberOfAyahs: arabicEdition.numberOfAyahs,
        revelationType: arabicEdition.revelationType,
      },
      editionId,
      editionName: editionMeta?.label ?? translationEdition?.edition?.name ?? editionId,
      ayahs,
      isFallback: false,
    }

    cachedSurahs.set(key, result)
    return result
  } catch (error) {
    const fallback = FALLBACK_SURAHS[surahNumber]
    if (fallback) {
      return fallback
    }
    throw error instanceof Error
      ? error
      : new Error('Unable to connect to the Qur’an service. Please retry.')
  }
}

export async function fetchSurahAudioUrls(surahNumber: number): Promise<string[]> {
  const existing = cachedAudio.get(surahNumber)
  if (existing) return existing

  const { data } = await quranClient.get<{ data: { ayahs: RawAyahResponse[] } }>(
    `/surah/${surahNumber}/ar.alafasy`,
  )
  const urls = (data.data?.ayahs ?? []).map((item) => item.audio ?? '').filter(Boolean)
  cachedAudio.set(surahNumber, urls)
  return urls
}

export async function fetchAyahByReference(
  reference: string,
  editionId = 'en.sahih',
): Promise<{ surahName: string; surahNumber: number; numberInSurah: number; arabic: string; translation: string }> {
  const { data } = await quranClient.get<{
    data: {
      text: string
      numberInSurah: number
      surah: { number: number; englishName: string }
    }[]
  }>(`/ayah/${encodeURIComponent(reference)}/editions/quran-uthmani,${editionId}`)

  const [arabicData, transData] = data.data
  return {
    surahName: arabicData.surah.englishName,
    surahNumber: arabicData.surah.number,
    numberInSurah: arabicData.numberInSurah,
    arabic: arabicData.text,
    translation: transData?.text ?? '',
  }
}

export async function searchQuranByKeyword(
  keyword: string,
  editionId = 'en.sahih',
): Promise<{ count: number; matches: QuranSearchHit[] }> {
  const clean = keyword.trim()
  if (!clean) return { count: 0, matches: [] }
  const { data } = await quranClient.get<{
    data: {
      count: number
      matches: Array<{
        numberInSurah: number
        text: string
        surah: { number: number; englishName: string }
      }>
    }
  }>(`/search/${encodeURIComponent(clean)}/all/${editionId}`)

  const matches: QuranSearchHit[] = (data.data?.matches ?? []).slice(0, 12).map((item) => ({
    surahNumber: item.surah.number,
    surahEnglishName: item.surah.englishName,
    numberInSurah: item.numberInSurah,
    text: item.text,
  }))

  return {
    count: data.data?.count ?? matches.length,
    matches,
  }
}
