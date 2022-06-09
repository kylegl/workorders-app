import { gasMutation, gasQuery } from './gas.js'
import type { BackendData, Versions } from './apiResponseTypes'

const isGoogle: boolean = import.meta.env.VITE_GOOGLE

const Query = async (): Promise<BackendData> => {
  let res

  if (isGoogle) {
    const result = await gasQuery()
    res = result
  }

  const response = await fetch('http://localhost:4000/mock-api')
  if (response.ok) {
    const result = await response.json()

    res = result
  }

  return res
}

async function Mutation({ items }): Promise<any> {
  if (isGoogle)
    return gasMutation({ items })
}

export { Query, Mutation }
