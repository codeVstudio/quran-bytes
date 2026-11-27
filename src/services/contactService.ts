import appConfig from '@/configs/app.config'
import endpointConfig from '@/configs/endpoint.config'

export interface ContactSubmissionPayload {
  fullName: string
  email: string
  subject: string
  message: string
  website?: string
  elapsedMs: number
}

export interface ContactSubmissionResponse {
  ok: boolean
  id?: string
  message: string
}

function resolveContactEndpoint(): string {
  const explicitEndpoint = import.meta.env.VITE_CONTACT_ENDPOINT?.trim()
  if (explicitEndpoint) return explicitEndpoint
  if (appConfig.authApiBaseUrl) {
    return `${appConfig.authApiBaseUrl.replace(/\/$/, '')}${endpointConfig.submitContact}`
  }
  return `${appConfig.apiPrefix}${endpointConfig.submitContact}`
}

export async function submitContactMessage(
  payload: ContactSubmissionPayload,
): Promise<ContactSubmissionResponse> {
  const endpoint = resolveContactEndpoint()
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new Error(
      'Unable to reach the contact backend endpoint right now. Please try again when the server endpoint is active.',
    )
  }

  const data = (await response.json()) as Partial<ContactSubmissionResponse>
  if (!response.ok || !data.ok) {
    throw new Error(
      data.message || 'Your message could not be submitted right now. Please try again shortly.',
    )
  }

  return {
    ok: true,
    id: data.id,
    message: data.message || 'Thank you. Your message has been received.',
  }
}
