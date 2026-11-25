import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

export interface AuthorityCheckProps {
  userAuthority: string[]
  authority: string[]
  children: ReactNode
}

export function AuthorityCheck({ userAuthority, authority, children }: AuthorityCheckProps) {
  const roleMatched =
    authority.length === 0 || authority.some((role) => userAuthority.includes(role))

  return roleMatched ? <>{children}</> : <Navigate to="/access-denied" replace />
}

export default AuthorityCheck
