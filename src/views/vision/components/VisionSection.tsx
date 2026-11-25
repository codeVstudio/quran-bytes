import { VISION_PRINCIPLES } from '../api/visionApi'

export function VisionSection() {
  return (
    <section className="mission" id="vision" aria-labelledby="mission-title">
      <svg className="mission-pattern" viewBox="0 0 840 900" fill="none" aria-hidden="true">
        <rect width="840" height="900" fill="url(#geometry)" />
        <path
          d="M60 880V465c0-190 160-280 360-435 200 155 360 245 360 435v415Z"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
      <div className="mission-grid">
        <div className="mission-intro">
          <h2 id="mission-title" className="reveal-heading">
            <span className="text-line">
              <span>Built for learning.</span>
            </span>
            <span className="text-line">
              <span>Not for</span>
            </span>
            <span className="text-line">
              <span>
                <em>advertising.</em>
              </span>
            </span>
          </h2>
          <p>
            Some things should be open to everyone.
            <br />
            We believe the space to learn is one of them.
          </p>
        </div>
        <ol className="mission-principles">
          {VISION_PRINCIPLES.map((item) => (
            <li key={item.number}>
              <span className="principle-number">{item.number}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default VisionSection
