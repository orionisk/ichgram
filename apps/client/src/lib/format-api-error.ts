import type { ErrorSchema } from '@ichgram/api-client'

export default function formatApiError(apiError: ErrorSchema) {
  return apiError
    .error
    .issues
    .reduce((all: string, issue: any) => `${all + issue.path.join('.')}: ${issue.message}\n`, '')
}
