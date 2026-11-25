import RtkQueryService from '@/services/RtkQueryService'

export interface UnderstandSourceNote {
  label: string
  primary: string
  secondary: string
}

const understandApi = RtkQueryService.injectEndpoints({
  endpoints: (builder) => ({
    getUnderstandNotes: builder.query<UnderstandSourceNote[], void>({
      queryFn: () => ({
        data: [
          { label: 'Original', primary: 'Qur’an · Al-Muzzammil 73:4', secondary: 'Excerpt from the ayah' },
          { label: 'Translation', primary: 'Saheeh International', secondary: 'English · excerpt' },
          { label: 'Tafsir', primary: 'Planned', secondary: 'Sources to be confirmed' },
        ],
      }),
    }),
  }),
})

export const { useGetUnderstandNotesQuery } = understandApi
export default understandApi
