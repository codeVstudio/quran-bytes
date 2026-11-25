import { Link } from 'react-router-dom'
import AdaptableCard from '@/components/shared/AdaptableCard'
import Container from '@/components/shared/Container'

export function Welcome() {
  return (
    <main id="main" className="min-h-screen bg-ivory py-32">
      <Container>
        <AdaptableCard className="max-w-2xl">
          <p className="label text-emerald-deep">Quran Bytes Workspace</p>
          <h1 className="mt-3 font-serif text-4xl text-ink">Assalamu alaikum.</h1>
          <p className="mt-3 text-sm text-muted">
            Select a learning module or return to the public showcase.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block border-b border-hairline pb-2 text-xs font-semibold text-emerald-deep"
          >
            Open Landing Experience ↗
          </Link>
        </AdaptableCard>
      </Container>
    </main>
  )
}

export default Welcome
