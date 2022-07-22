import type { MutationType, RequestType, VersionType } from '~/types'
import { apiResponseValidator } from '~/types'
import { getErrorMessage } from '~/composables/utils'

export const handleResponse = (rawResponse: string) => {
  const parsedRes = JSON.parse(rawResponse)

  const res = apiResponseValidator.parse(parsedRes)
  return res
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

export async function gasQuery(versions: VersionType, path: string) {
  try {
    const request = {
      path,
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

