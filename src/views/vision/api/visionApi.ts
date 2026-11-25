import RtkQueryService from '@/services/RtkQueryService'
import type { VisionPrinciple } from '@/@types/quran'

export const VISION_PRINCIPLES: VisionPrinciple[] = [
  {
    number: '01',
    title: 'Free. By intention.',
    description:
      'No ads. No paywalls. Access to learning should never depend on what you can afford.',
  },
  {
    number: '02',
    title: 'Open by design.',
    description:
      'Open-source development. A project you can look into, learn from, and help make better.',
  },
  {
    number: '03',
    title: 'Clarity at the source.',
    description:
      'References and attribution, kept close to the content. A clear distinction between text, translation, and explanation.',
  },
  {
    number: '04',
    title: 'Better, together.',
    description:
      'Built with the care of developers, designers, translators, educators, and people like you.',
  },
]

const visionApi = RtkQueryService.injectEndpoints({
  endpoints: (builder) => ({
    getVisionPrinciples: builder.query<VisionPrinciple[], void>({
      queryFn: () => ({ data: VISION_PRINCIPLES }),
      providesTags: ['Vision'],
    }),
  }),
})

export const { useGetVisionPrinciplesQuery } = visionApi
export default visionApi
