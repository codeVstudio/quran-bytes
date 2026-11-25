import RtkQueryService from '@/services/RtkQueryService'

export interface PracticeLoopConfig {
  targetRepetitions: number
  scheduleDays: number[]
}

const memorizeApi = RtkQueryService.injectEndpoints({
  endpoints: (builder) => ({
    getPracticeSchedule: builder.query<PracticeLoopConfig, void>({
      queryFn: () => ({
        data: { targetRepetitions: 3, scheduleDays: [0, 3, 7] },
      }),
    }),
  }),
})

export const { useGetPracticeScheduleQuery } = memorizeApi
export default memorizeApi
