import RtkQueryService from '@/services/RtkQueryService'
import type { DailyPracticeItem } from '@/@types/quran'

const practiceApi = RtkQueryService.injectEndpoints({
  endpoints: (builder) => ({
    getDailyPractice: builder.query<Record<'dua' | 'hadith', DailyPracticeItem>, void>({
      query: () => ({
        url: '/data/preview-excerpts.json',
        baseURL: '',
        method: 'GET',
      }),
      transformResponse: (res: {
        practice: Record<'dua' | 'hadith', { arabic: string; translation: string; source: string }>
      }) => ({
        dua: {
          id: 'dua',
          tabLabel: 'Dua',
          kicker: 'For beneficial knowledge',
          ...res.practice.dua,
        },
        hadith: {
          id: 'hadith',
          tabLabel: 'Hadith',
          kicker: 'Learn, and pass it on',
          ...res.practice.hadith,
        },
      }),
      providesTags: ['Excerpts'],
    }),
  }),
})

export const { useGetDailyPracticeQuery } = practiceApi
export default practiceApi
