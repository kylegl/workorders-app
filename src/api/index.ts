import { gasMutation, gasQuery } from './gas.js'
import type { BackendData, Versions } from './apiResponseTypes'
const isProd = process.env.NODE_ENV === 'production'

const Query = async (): Promise<BackendData> => {
  let res

  if (isProd) {
    const result = await gasQuery()
    res = result
  }

  if (!isProd) {
    const response = await fetch('http://localhost:4000/mock-api')
    if (response.ok) {
      const result = await response.json()

      res = result
    }
  }

  return res
}

async function Mutation({ items }): Promise<any> {
  if (isProd)
    return gasMutation({ items })
}

export { Query, Mutation }
