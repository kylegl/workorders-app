import { apiResponseValidator } from '~/types'
import { useMainStore } from '~/stores/mainStore'
import { getErrorMessage } from '~/composables/utils'

const handleResponse = (rawResponse: string) => {
  const [[parsedRes]] = JSON.parse(rawResponse)

  const res = apiResponseValidator.parse(parsedRes)

  return res
}

const createTask = ({ namespace, action, params }) => ({ namespace, action, params })

const createJob = ({ namespace, tasks }) => {
  return { namespace, tasks }
}

const stringifyDeltas = (entry) => {
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

const serverRequest = async (requests) => {
  return await Provoke.run('requestHandler', requests)
}

const gasQuery = async () => {
  try {
    const mainStore = useMainStore()

    const clientVersions = mainStore.client.versions

    const requests = [
      createJob({
        namespace: 'database',
        tasks: [
          createTask({ namespace: 'database', action: 'get', params: { clientVersions } }),
        ],
      }),
    ]

    const res: string = await serverRequest(requests)
    return handleResponse(res)
  }
  catch (err) {
    const msg = getErrorMessage(err)
    console.error('error', msg)
  }
}

const gasMutation = async ({ mutations }) => {
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
            tableName: mutation.type,
            data: [mutation.data],
            clientVersions: mutation.versions,
          },
        }),
      ],
    })
  })

  console.log('gas mutation server side', requests)
  const rawResponse = await serverRequest(requests)
  return handleResponse(rawResponse)
}

export { Provoke, serverRequest, createTask, createJob, gasQuery, gasMutation }

