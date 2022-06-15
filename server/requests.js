const requestHandler = ({ requests }) => {
  const res = requests.map((req) => {
    return jobHandler({ req })
  })
  return JSON.stringify(res)
}

const jobHandler = ({ req }) => {
  return req.tasks.map((task) => {
    return taskHandler({ task })
  })
}

const taskHandler = ({ task }) => {
  const { namespace, action, params } = task

  return Router(params)[namespace][action]()
}

const Router = (params) => {
  const table = new TableController({ tableName: params.tableName, data: params.data })
  const database = new DatabaseController({ clientVersions: params.clientVersions })

  return {
    table,
    database,
  }
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
