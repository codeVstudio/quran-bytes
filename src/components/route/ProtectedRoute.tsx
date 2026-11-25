import { Navigate, Outlet, useLocation } from 'react-router-dom'
import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import useAuth from '@/utils/hooks/useAuth'

export function ProtectedRoute() {
  const { authenticated } = useAuth()
  const location = useLocation()

  if (!authenticated) {
    return (
      <Navigate
        to={`${appConfig.unAuthenticatedEntryPath}?${REDIRECT_URL_KEY}=${encodeURIComponent(location.pathname)}`}
        replace
      />
    )
  }

  return <Outlet />
}

export default ProtectedRoute
