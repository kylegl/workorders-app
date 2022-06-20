import { gasMutation, gasQuery } from './gas'
import type { ApiResponse, VersionType } from '~/types'

const isProd = process.env.NODE_ENV === 'production'

export async function Query(versions: VersionType) {
  try {
    if (isProd) {
      const result = await gasQuery(versions)
      if (!result)
        throw new Error('No response from API')

      return result as ApiResponse
    }

    if (!isProd) {
      const response = await fetch('http://localhost:4000/mock-api')
      if (response.ok) {
        const result = await response.json()
        console.log('mock response', result)

        return result as ApiResponse
      }
    }
  }
  catch (err) {
    const msg = getErrorMessage(err)
    console.error('error', msg)
    return { ok: false, data: undefined, versions: undefined } as ApiResponse
  }
}

export async function Mutation(mutations: Array<any>): Promise<any> {
  try {
    if (isProd)
      return gasMutation(mutations)
  }
  catch (err) {
    const msg = getErrorMessage(err)
    console.error('error', msg)
    return { ok: false, data: undefined, versions: undefined }
  }
}

