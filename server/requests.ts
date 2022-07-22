type Versions = Record<string, string | undefined>

interface ClientRequest {
  path: string
  cache: Versions
  method: string
  body?: string | undefined
}

const router = () => {
  return {
    database: (versions: Versions) => new DatabaseController({ clientVersions: versions }),
    drive: (fileId: string) => SpreadsheetApp.openById(fileId),
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const requestHandler = (req: ClientRequest) => {
  try {
    let body
    if (req?.body)
      body = JSON.parse(req?.body)

    const [namespace, action] = req.path.split('/')

    const res = router()[namespace](req.cache)[action](body)

    return JSON.stringify(res)
  }
  catch (err) {
    console.error(err)
    unlockAll()
  }
}

// const test = () => {
//   const request = {
//     path: 'database/add',
//     method: 'POST',
//     cache:
//  {
//    bids: 'bdae00bf-4157-4baa-b449-f2d1ee374ea2',
//    clients: 'fed9b534-eeac-417b-9100-460ebd5cb341',
//    workorders: '44213ec6-ccc9-4229-9549-73757b0cee2f',
//    jobs: '57ba6890-b397-4e92-9737-797b5eb79911',
//    main: '90e5b309-a40c-4a02-9015-53bfed21dd58',
//    employees: '7c94735c-6d94-4f9c-9cde-d9af9531b864',
//    line_items: '897a927f-aafc-442d-875c-bd0bb66f2e0e',
//    contacts: '85cc21b6-24d4-4fc5-a076-14ede5bb4c94',
//  },
//     body: '{"table":"workorders","data":{"id":"hkBJ3j5ohZY6yHY6Q3KkS5","FK|client_id":"dff5aeeb-e989-45ec-b4e4-a65e8814a041","FK|contact_id":"0af31216-5fc6-4d26-a2b4-6747171a3a3c","FK|job_id":"85e7fffc-2872-48b6-ba99-9d770577776b","start_date":null,"due_date":null,"description":"","parking_info":"","notes":"","bill_type":"","job_type":"","created_at":1655713752939,"closed_at":null,"status":""}}',
//   }
//   console.log('res', requestHandler(request))
// }

// const unlocker = () => unlockAll()

