interface Router {
  table: TableControllerType
  database: Function
}

type Namespace = keyof Router

type Version = string

type Versions = {
  [key in keyof Database]: Version
}

interface TaskParams {
  tableName: TableName
  data: Array<any>
  clientVersions: Versions
}

interface Task {
  namespace: Namespace
  action: Action
  params: TaskParams
}

interface Request {
  namespace: Namespace
  tasks: Task[]
}

type Action = keyof Namespace

interface Database extends Tables {
  main: Version
}

interface Tables {
  employees: Array<any>
  contacts: Array<any>
  clients: Array<any>
  bids: Array<any>
  jobs: Array<any>
  workorders: Array<any>
  line_items: Array<any>
}

const router = (params: TaskParams) => {
  const table = new TableController({ tableName: params.tableName, data: params.data, version: params.clientVersions[params.tableName] })
  const database = new DatabaseController({ clientVersions: params.clientVersions })

  return {
    table,
    database,
  }
}

const taskHandler = (task: Task) => {
  const { namespace, action, params } = task

  return router(params)[namespace][action]()
}

const jobHandler = (req: Request) => {
  return req.tasks.map((task) => {
    return taskHandler(task)
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const requestHandler = (requests: Request[]) => {
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
