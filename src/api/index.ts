import { gasMutation, gasQuery } from './gas'
import type { ApiResponse, MutationType, VersionType } from '~/types'
import { apiResponseValidator } from '~/types'

const isProd = process.env.NODE_ENV === 'production'

export async function Query(versions: VersionType, path: string) {
  try {
    if (isProd) {
      const result = await gasQuery(versions, path)
      if (!result)
        throw new Error('No response from API')

      return result as ApiResponse
    }

    if (!isProd) {
      const response = await fetch('http://localhost:4000/mock-api')
      if (response.ok) {
        const result = await response.json()

        return apiResponseValidator.parse(result)
      }
    }
  }
  catch (err) {
    const msg = getErrorMessage(err)
    console.error('error', msg)
    return { ok: false, data: undefined, versions: undefined } as ApiResponse
  }
}

export async function Mutation(mutation: MutationType, versions: VersionType, action: string): Promise<any> {
  try {
    if (isProd)
      return gasMutation(mutation, versions, action)
  }
  catch (err) {
    const msg = getErrorMessage(err)
    console.error('error', msg)
    return { ok: false, data: undefined, versions: undefined }
  }
}

