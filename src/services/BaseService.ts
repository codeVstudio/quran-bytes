import axios from 'axios'
import appConfig from '@/configs/app.config'
import { API_TIMEOUT, REQUEST_HEADER_AUTH_KEY, TOKEN_TYPE } from '@/constants/api.constant'
import { PERSIST_STORE_NAME } from '@/constants/app.constant'

const BaseService = axios.create({
  timeout: API_TIMEOUT,
  baseURL: appConfig.apiPrefix,
})

BaseService.interceptors.request.use(
  (config) => {
    try {
      const rawState = localStorage.getItem(`persist:${PERSIST_STORE_NAME}`)
      if (rawState) {
        const parsedRoot = JSON.parse(rawState) as { auth?: string }
        if (parsedRoot.auth) {
          const authState = JSON.parse(parsedRoot.auth) as { session?: { token?: string } }
          const token = authState.session?.token
          if (token) {
            config.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE}${token}`
          }
        }
      }
    } catch {
      /* Ignore malformed storage state */
    }
    return config
  },
  (error) => Promise.reject(error),
)

BaseService.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)

export default BaseService
