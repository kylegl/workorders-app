import { useMainStore } from '~/stores/mainStore'
import { getErrorMessage, isDate, isFK } from '~/composables/utils'

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

    console.log('gas query', requests)
    const res = await serverRequest(requests)
    const [[parsedRes]] = JSON.parse(res)

    let formattedRes = {}

    Object.keys(parsedRes).forEach((key) => {
      const item = parsedRes[key]
      if (!item?.data) return item

      const formattedData = item.data.map((row) => {
        row.id = row.id.toString()

        Object.keys(row).forEach((key) => {
          if (!row[key]) return

          if (isFK(key)) row[key] = row[key].toString()
          if (isDate(key)) row[key] = parseInt(row[key])
        })

        return row
      })

      formattedRes = {
        ...formattedRes,
        [key]: { ...item, data: formattedData },
      }
    })
    return formattedRes
  }
  catch (err) {
    getErrorMessage(err)
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
  const res = await serverRequest(requests)
  return res
}

const serverRequest = async (requests) => {
  return await Provoke.run('requestHandler', requests)
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

export { Provoke, serverRequest, createTask, createJob, gasQuery, gasMutation }
