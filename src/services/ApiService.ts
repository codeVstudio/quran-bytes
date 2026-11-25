import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import BaseService from './BaseService'

const ApiService = {
  fetchData<Response = unknown, Request = Record<string, unknown>>(
    param: AxiosRequestConfig<Request>,
  ): Promise<AxiosResponse<Response>> {
    return new Promise((resolve, reject) => {
      BaseService(param)
        .then((response: AxiosResponse<Response>) => resolve(response))
        .catch((errors: AxiosError) => reject(errors))
    })
  },
}

export default ApiService
