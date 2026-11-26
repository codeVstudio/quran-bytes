export type AppConfig = {
  apiPrefix: string
  authApiBaseUrl: string
  quranApiBaseUrl: string
  authenticatedEntryPath: string
  unAuthenticatedEntryPath: string
  locale: string
  enableMock: boolean
}

const appConfig: AppConfig = {
  apiPrefix: '/api',
  authApiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',
  quranApiBaseUrl: 'https://api.alquran.cloud/v1',
  authenticatedEntryPath: '/get-started',
  unAuthenticatedEntryPath: '/',
  locale: 'en',
  enableMock: false,
}

export default appConfig
