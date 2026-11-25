import { createApi, type BaseQueryFn } from '@reduxjs/toolkit/query/react'
import type { AxiosError, AxiosRequestConfig } from 'axios'
import BaseService from './BaseService'

const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string
      method?: AxiosRequestConfig['method']
      data?: AxiosRequestConfig['data']
      params?: AxiosRequestConfig['params']
      baseURL?: string
    },
    unknown,
    unknown
  > =>
  async ({ url, method = 'GET', data, params, baseURL }) => {
    try {
      const result = await BaseService({
        url,
        baseURL: baseURL ?? BaseService.defaults.baseURL,
        method,
        data,
        params,
      })
      return { data: result.data }
    } catch (axiosError) {
      const err = axiosError as AxiosError
      return {
        error: {
          status: err.response?.status ?? 500,
          data: err.response?.data ?? err.message,
        },
      }
    }
  }

const RtkQueryService = createApi({
  reducerPath: 'rtkQueryApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Excerpts', 'Vision', 'Updates'],
  endpoints: () => ({}),
})

export default RtkQueryService
