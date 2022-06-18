import { gasMutation, gasQuery } from './gas.js'
import type { ApiResponse } from '~/types'
const isProd = process.env.NODE_ENV === 'production'

const Query = async (): Promise<ApiResponse> => {
  if (isProd) {
    const result = await gasQuery()
    return result
  }

  if (!isProd) {
    const response = await fetch('http://localhost:4000/mock-api')
    if (response.ok) {
      const result = await response.json()

      return result
    }
  }
}

async function Mutation({ items }): Promise<any> {
  if (isProd)
    return gasMutation({ items })
}

export { Query, Mutation }
