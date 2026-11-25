export function SvgDefs() {
  return (
    <svg className="svg-library" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <pattern id="geometry" width="84" height="84" patternUnits="userSpaceOnUse">
          <path
            d="M42 0 84 42 42 84 0 42Z M12.3 12.3h59.4v59.4H12.3Z M0 0h84v84H0Z"
            fill="none"
            stroke="currentColor"
            strokeWidth=".65"
          />
          <path
            d="M0 42h12.3M71.7 42H84M42 0v12.3M42 71.7V84"
            fill="none"
            stroke="currentColor"
            strokeWidth=".65"
          />
          <circle cx="42" cy="42" r="3" fill="none" stroke="currentColor" strokeWidth=".5" />
        </pattern>
        <clipPath id="arch-clip">
          <path d="M25 580V243C25 148 108 102 210 22c102 80 185 126 185 221v337Z" />
        </clipPath>
        <symbol id="arch-line" viewBox="0 0 420 600">
          <path d="M25 580V243C25 148 108 102 210 22c102 80 185 126 185 221v337Z" />
        </symbol>
        <symbol id="icon-arrow" viewBox="0 0 24 24">
          <path d="M4 12h15M13 5l7 7-7 7" />
        </symbol>
        <symbol id="icon-arrow-up" viewBox="0 0 24 24">
          <path d="M6 18 18 6M6 6h12v12" />
        </symbol>
        <symbol id="icon-play" viewBox="0 0 24 24">
          <path d="m9 5 11 7-11 7Z" />
        </symbol>
        <symbol id="icon-pause" viewBox="0 0 24 24">
          <path d="M9 5v14M16 5v14" />
        </symbol>
        <symbol id="icon-star" viewBox="0 0 40 40">
          <path d="m20 2 5.3 5.3H32v7.4l6 5.3-6 5.3V32h-6.7L20 38l-5.3-6H8v-6.7L2 20l6-5.3V7.3h6.7Z" />
          <circle cx="20" cy="20" r="7" />
        </symbol>
        <symbol id="sky-star" viewBox="0 0 16 16">
          <path d="m8 0 1.9 6.1L16 8l-6.1 1.9L8 16 6.1 9.9 0 8l6.1-1.9Z" />
        </symbol>
      </defs>
    </svg>
  )
}

export default SvgDefs
