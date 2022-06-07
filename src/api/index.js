import { gasMutation, gasQuery } from './gas.js'

const isGoogle = import.meta.env.VITE_GOOGLE

const Query = async () => {
  if (isGoogle)
    return await gasQuery()

  const response = await fetch('http://localhost:3333/mock-api')
  if (response.ok) {
    const result = await response.json()

    return result
  }
}

const Mutation = async ({ items }) => {
  if (isGoogle)
    return gasMutation({ items })
}

export { Query, Mutation }
