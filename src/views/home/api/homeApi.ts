import RtkQueryService from '@/services/RtkQueryService'
import endpointConfig from '@/configs/endpoint.config'
import type { VerseExcerpt } from '@/@types/quran'

export interface PreviewExcerptsPayload {
  readExcerpt: VerseExcerpt
}

const homeApi = RtkQueryService.injectEndpoints({
  endpoints: (builder) => ({
    getPreviewExcerpts: builder.query<PreviewExcerptsPayload, void>({
      query: () => ({
        url: endpointConfig.previewExcerpts,
        baseURL: '',
        method: 'GET',
      }),
      providesTags: ['Excerpts'],
    }),
  }),
})

export const { useGetPreviewExcerptsQuery } = homeApi
export default homeApi
