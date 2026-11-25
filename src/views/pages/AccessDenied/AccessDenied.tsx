import { Link } from 'react-router-dom'
import Container from '@/components/shared/Container'

export function AccessDenied() {
  return (
    <main id="main" className="flex min-h-screen items-center bg-ivory py-24">
      <Container className="text-center">
        <p className="label text-gold-text">403 · Restricted</p>
        <h1 className="mt-4 font-serif text-5xl text-ink">Access Denied</h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-muted">
          You do not have permission to view this section.
        </p>
        <Link
          to="/"
          className="mt-8 inline-block border-b border-hairline pb-2 text-xs font-semibold text-emerald-deep"
        >
          Return to Quran Bytes ↗
        </Link>
      </Container>
    </main>
  )
}

export default AccessDenied
