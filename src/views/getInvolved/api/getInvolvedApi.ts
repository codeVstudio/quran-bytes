import RtkQueryService from '@/services/RtkQueryService'
import endpointConfig from '@/configs/endpoint.config'
import type { ApiResponse } from '@/@types/common'
import type { ContributeSkill } from '@/@types/quran'

export interface ContributionInterestPayload {
  email: string
  skills: ContributeSkill[]
}

const getInvolvedApi = RtkQueryService.injectEndpoints({
  endpoints: (builder) => ({
    subscribeUpdates: builder.mutation<ApiResponse<null>, { email: string }>({
      query: (data) => ({
        url: endpointConfig.subscribeUpdates,
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Updates'],
    }),
    submitContribution: builder.mutation<ApiResponse<null>, ContributionInterestPayload>({
      query: (data) => ({
        url: endpointConfig.submitContribution,
        method: 'POST',
        data,
      }),
    }),
  }),
})

export const { useSubscribeUpdatesMutation, useSubmitContributionMutation } = getInvolvedApi
export default getInvolvedApi
