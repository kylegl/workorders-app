import type { Data, MutationType, RequestType, VersionType } from '~/types'
import { apiResponseValidator } from '~/types'
import { getErrorMessage } from '~/composables/utils'

const handleResponse = (rawResponse: string) => {
  const parsedRes = JSON.parse(rawResponse)
  console.log('parsedRes', parsedRes)
  const res = apiResponseValidator.parse(parsedRes)
  return res
}

const stringifyDeltas = (entry: Data) => {
  const keys = Object.keys(entry)

  const deltaKeys = ['description', 'notes', 'parking_info', 'details', 'quantity']

  return keys.reduce((result, key) => {
    if (deltaKeys.includes(key) && entry[key])
      result[key] = JSON.stringify(entry[key])
    else result[key] = entry[key]

    return result
  }, {})
}
const parseDeltas = (entry: Data) => {
  const keys = Object.keys(entry)

  const deltaKeys = ['description', 'notes', 'parking_info', 'details', 'quantity']

  return keys.reduce((result, key) => {
    if (deltaKeys.includes(key) && entry[key])
      result[key] = JSON.parse(entry[key])
    else result[key] = entry[key]

    return result
  }, {})
}

const Provoke = ((ns) => {
  /**
  * run something asynchronously
  * @param {string} name the name in whitelistedactions
  * @param {[...]} the args
  * @return {Promise} a promise
  */
  ns.run = function (name, ...runArgs) {
    // this will return a promise
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-undef
      google.script.run
        .withFailureHandler((err) => {
          reject(err)
        })
        .withSuccessHandler((result) => {
          resolve(result)
        })
        .runWhitelist(name, ...runArgs)
    })
  }

  return ns
})({})

const serverRequest = async (request: RequestType) => {
  return await Provoke.run('requestHandler', request)
}

export async function gasQuery(versions: VersionType) {
  try {
    const request = {
      path: 'database/get',
      method: 'GET',
      cache: versions,
    }

    const rawRes: string = await serverRequest(request)
    const res = handleResponse(rawRes)
    return res
  }
  catch (err) {
    const msg = getErrorMessage(err)
    console.error('error', msg)
    return { ok: false, data: undefined, versions: undefined }
  }
}

export async function gasMutation(mutation: MutationType, versions: VersionType, action: string) {
  try {
    // if (mutation?.data)
      // mutation.data = stringifyDeltas(mutation.data)

    const request = {
      path: `database/${action}`,
      method: 'POST',
      body: JSON.stringify(mutation),
      cache: versions,
    }

    const rawResponse = await serverRequest(request)
    return handleResponse(rawResponse)
  }
  catch (err) {
    const msg = getErrorMessage(err)
    console.error('error', msg)
    return { ok: false, data: undefined, versions: undefined }
  }
}

