import type { Data, GasJobType, GasTaskType, MutationType, VersionType } from '~/types'
import { apiResponseValidator, gasJobValidator, gasTaskValidator } from '~/types'
import { useMainStore } from '~/stores/mainStore'
import { getErrorMessage } from '~/composables/utils'

const handleResponse = (rawResponse: string) => {
  const [[parsedRes]] = JSON.parse(rawResponse)

  const res = apiResponseValidator.parse(parsedRes)
  return res
}

const createTask = ({ namespace, action, params }: GasTaskType) => gasTaskValidator.parse({ namespace, action, params })

const createJob = ({ namespace, tasks }: GasJobType) => gasJobValidator.parse({ namespace, tasks })

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

const serverRequest = async (requests: Array<any>) => {
  return await Provoke.run('requestHandler', requests)
}

export async function gasQuery(versions: VersionType) {
  try {
    const requests = [
      createJob({
        namespace: 'database',
        tasks: [
          createTask({ namespace: 'database', action: 'get', params: { clientVersions: versions } }),
        ],
      }),
    ]

    const rawRes: string = await serverRequest(requests)
    const res = handleResponse(rawRes)
    return res
  }
  catch (err) {
    const msg = getErrorMessage(err)
    console.error('error', msg)
    return { ok: false, data: undefined, versions: undefined }
  }
}

const gasMutation = async (mutations: MutationType[]) => {
  const requests = mutations.map((mutation) => {
    if (mutation?.data)
      mutation.data = stringifyDeltas(mutation.data)

    return createJob({
      namespace: 'database',
      tasks: [
        createTask({
          namespace: 'database',
          action: mutation.action,
          params: {
            tableName: mutation.table,
            data: [mutation.data],
            clientVersions: mutation.versions,
          },
        }),
      ],
    })
  })

  const rawResponse = await serverRequest(requests)
  return handleResponse(rawResponse)
}

export { Provoke, serverRequest, createTask, createJob, gasMutation }

// TODO check why the clientVersions are not being sent from client to server
