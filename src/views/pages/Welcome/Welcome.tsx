import { Navigate } from 'react-router-dom'

export function Welcome() {
  return <Navigate to="/get-started" replace />
}

export default Welcome
