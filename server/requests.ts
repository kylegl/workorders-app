interface Task {
  namespace: string
  action: string
  params: {
    tableName: string
    data: TableData
    clientVersions: Versions
  }
}

type Versions = Record<string, string | undefined>

type RouterResponse = Record<string, DatabaseController>

interface ClientRequest {
  namespace: keyof RouterResponse
  tasks: Task[]
}
const getDatabaseController = (clientVersions: Versions) => {
  return new DatabaseController({ clientVersions })
}

const router = (params: Versions) => {
  const database = getDatabaseController(params)

  return {
    database,
  } as RouterResponse
}

const taskHandler = (task: Task) => {
  const { namespace, action, params } = task

  const controller = router(params.clientVersions)[namespace]

  const res: DatabaseControllerResponse = controller[action]({
    tableName: params.tableName,
    version: params.clientVersions[params.tableName],
    data: params.data,
  })

  return res as DatabaseControllerResponse
}

const jobHandler = (req: ClientRequest) => {
  return req.tasks.map((task) => {
    return taskHandler(task)
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const requestHandler = (requests: ClientRequest[]) => {
  console.log('req', JSON.stringify(requests))
  const res = requests.map((req) => {
    return jobHandler(req)
  })
  return JSON.stringify(res)
}

// const test = () => {
//   const requests = [
//     {
//       namespace: 'database',
//       tasks: [
//         {
//           namespace: 'database',
//           action: 'get',
//           params: {
//             clientVersions: {
//               main: undefined,
//               workorders: undefined,
//               line_items: undefined,
//               contacts: undefined,
//               employees: undefined,
//               clients: undefined,
//             },
//           },
//         },
//       ],

//     },
//   ]

//   console.log('res', requestHandler({ requests }))
// }
