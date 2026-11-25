import RtkQueryService from '@/services/RtkQueryService'
import type { VerseExcerpt } from '@/@types/quran'

const readApi = RtkQueryService.injectEndpoints({
  endpoints: (builder) => ({
    getReadPreview: builder.query<VerseExcerpt, void>({
      query: () => ({
        url: '/data/preview-excerpts.json',
        baseURL: '',
        method: 'GET',
      }),
      transformResponse: (res: { readExcerpt: VerseExcerpt }) => res.readExcerpt,
      providesTags: ['Excerpts'],
    }),
  }),
})

export const { useGetReadPreviewQuery } = readApi
export default readApi
