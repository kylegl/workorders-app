import { useMainStore } from '~/stores/mainStore'

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

  const res = await serverRequest({ requests })
  const [[parsedRes]] = JSON.parse(res)
  return parsedRes
}

const gasMutation = async ({ items }) => {
  const requests = items.map((item) => {
    return createJob({
      namespace: item.namespace,
      tasks: [
        createTask({
          namespace: item.namespace,
          action: item.action,
          params: item.params,
        }),
      ],
    })
  })

  const res = await serverRequest({ requests })
  return res
}

const serverRequest = async ({ requests }) => {
  return await Provoke.run('requestHandler', { requests })
}

const createTask = ({ namespace, action, params }) => {
  return { namespace, action, params }
}

const createJob = ({ namespace, tasks }) => {
  return { namespace, tasks }
}

export { Provoke, serverRequest, createTask, createJob, gasQuery, gasMutation }
