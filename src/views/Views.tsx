import { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppRoute from '@/components/route/AppRoute'
import AuthorityCheck from '@/components/route/AuthorityCheck'
import ProtectedRoute from '@/components/route/ProtectedRoute'
import PublicRoute from '@/components/route/PublicRoute'
import appConfig from '@/configs/app.config'
import { protectedRoutes, publicRoutes } from '@/configs/routes.config'
import useAuth from '@/utils/hooks/useAuth'

function AllRoutes() {
  const { authority } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<PublicRoute />}>
        {publicRoutes.map((route) => (
          <Route
            key={route.key}
            path={route.path}
            element={
              <AppRoute routeKey={route.key} component={route.component} meta={route.meta} />
            }
          />
        ))}
      </Route>
      <Route path="/" element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate replace to={appConfig.authenticatedEntryPath} />} />
        {protectedRoutes.map((route) => (
          <Route
            key={route.key}
            path={route.path}
            element={
              <AuthorityCheck userAuthority={authority} authority={route.authority}>
                <AppRoute routeKey={route.key} component={route.component} meta={route.meta} />
              </AuthorityCheck>
            }
          />
        ))}
      </Route>
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  )
}

export function Views() {
  return (
    <Suspense fallback={null}>
      <AllRoutes />
    </Suspense>
  )
}

export default Views
