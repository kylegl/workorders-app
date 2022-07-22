/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
const syncFromMainDB = () => {
  const DBValues = SpreadsheetApp.openById('1FY1m2zRekFtB8mfBlkS1WXvyQ-0V_AOq6EIiuGySXs8')
    .getSheetByName('DB')
    .getDataRange()
    .getValues()

  DBValues.shift()

  const DB = new cUseful.Fiddler().setValues(DBValues).getData()
  const contacts = getSheetInterface({ sheetName: 'contacts' }).getData()
  const newBids = getSheetInterface({ sheetName: 'bids' }).getData()

  const bids = DB.filter(entry => entry.status)
  const jobs = DB.filter(entry => entry.job_id)
  const clientsDB = new Set(DB.map(entry => entry.company.trim()))

  const updatedClients = syncClients({ clientsDB })

  syncBids({ bids, contacts, clients: updatedClients })
  syncJobs({ jobs, contacts, clients: updatedClients, bids: newBids })
}

const syncClients = ({ clientsDB }) => {
  const clientsInterface = getSheetInterface({ sheetName: 'clients' })
  const clientsData = clientsInterface.getData()
  const clientsDBData = Array.from(clientsDB)

  clientsDBData.forEach((client) => {
    if (!clientsData.find(entry => entry.name === client)) {
      clientsData.push({
        id: Utilities.getUuid(),
        name: client,
      })
    }
  })

  clientsInterface.setData(clientsData)
  setSheetValues({ sheetInterface: clientsInterface })
  return clientsData
}

const syncJobs = ({ jobs, contacts, clients, bids }) => {
  const jobsInterface = getSheetInterface({ sheetName: 'jobs' })
  const jobData = jobsInterface.getData()
  const headers = jobsInterface.getHeaders()

  const idErrors = []

  const updatedJobs = jobs.map((entry) => {
    const existingEntry = jobData.find(item => item.job_number === entry.job_id)
    const id = existingEntry?.id || Utilities.getUuid()
    const client_id = existingEntry?.['FK|client_id'] || clients.find(client => client.name.trim() === entry.company.trim())?.id
    const contact_id = existingEntry?.['FK|contact_id'] || contacts.find(contact => contact.name.trim() === entry.contact.trim())?.id
    const bid_id = entry?.status ? bids.find(bid => bid.bid_id === entry.bid_id)?.id : undefined

    const job = {
      id,
      'FK|client_id': client_id,
      'FK|contact_id': contact_id,
      'billing_type': entry.tm,
      'FK|bid_id': bid_id,
      'contract_total': entry.job_total,
      'job_type': entry.finishing,
      'status': entry.job_status,
      'sheet_id': entry.job_sheet_id,
      'closed_date': entry.job_closed_date,
      'job_number': entry.job_id,
      'prevailing_wage': entry.prevailing_wage !== 'No',
    }

    headers.filter(item => ![
      'id',
      'FK|client_id',
      'FK|contact_id',
      'FK|bid_id',
      'billing_type',
      'contract_total',
      'job_type',
      'status',
      'sheet_id',
      'closed_date',
      'job_number',
      'prevailing_wage',
    ]
      .includes(item)).forEach((el) => {
      job[el] = entry[el]
    })

    if (!job?.['FK|client_id']) idErrors.push({ id: job.id, client: entry.company })

    return job
  })

  jobsInterface.setData(updatedJobs)

  if (idErrors.length)
    console.error('During jobs sync could not find ID matches for these items: ', idErrors)

  setSheetValues({ sheetInterface: jobsInterface })
}

const syncBids = ({ bids, contacts, clients }) => {
  const bidsInterface = getSheetInterface({ sheetName: 'bids' })
  const bidData = bidsInterface.getData()
  const headers = bidsInterface.getHeaders()

  const idErrors = []

  const updatedBids = bids.map((entry) => {
    const existingEntry = bidData.find(item => item.bid_id === entry.bid_id)
    const id = existingEntry?.id || Utilities.getUuid()
    const client_id = existingEntry?.['FK|client_id'] || clients.find(client => client.name.trim() === entry.company.trim())?.id
    const contact_id = existingEntry?.['FK|contact_id'] || contacts.find(contact => contact.name.trim() === entry.contact.trim())?.id

    const bid = {
      id,
      'FK|client_id': client_id,
      'FK|contact_id': contact_id,
      'billing_type': entry.tm,
      'prevailing_wage': entry.prevailing_wage !== 'No',
    }

    headers.filter(item => !['id', 'FK|client_id', 'FK|contact_id', 'billing_type', 'prevailing_wage'].includes(item)).forEach((el) => {
      bid[el] = entry[el]
    })

    if (!bid?.['FK|client_id']) idErrors.push({ id: bid.id, client: entry.company })

    return bid
  })

  bidsInterface.setData(updatedBids)

  if (idErrors.length)
    console.error('During bids sync could not find ID matches for these items: ', idErrors)

  setSheetValues({ sheetInterface: bidsInterface })
}

const setSheetValues = ({ sheetInterface }) => {
  const range = sheetInterface.getRange()
  range.getSheet().clearContents()

  sheetInterface.getRange().setValues(sheetInterface.createValues())
}

const createWos = () => {
  const employees = getSheetInterface({ sheetName: 'employees' }).getData()
  const jobs = getSheetInterface({ sheetName: 'jobs' }).getData()
  const wsData = getSheetInterface({ sheetName: 'ws-wos' }).getData()
  const woInterface = getSheetInterface({ sheetName: 'workorders' })
  const woData = woInterface.getData()

  const jobNumsNotInDb = []

  const newWos = wsData.map((entry) => {
    const wo = { ...newWorkorder }
    const { result: { jobId, clientId, bidId }, error } = checkJobNumber(entry, jobs)
    const contactIds = checkContact(entry, clientId) ?? []
    const { employeeId } = checkEmployee(entry, employees)

    wo.id = Utilities.getUuid()
    wo.wo_number = entry.wo_number
    wo['FK|job_id'] = jobId
    wo['FK|client_id'] = clientId
    wo['FK|bid_id'] = bidId
    wo['FK|contact_id'] = JSON.stringify([...contactIds])
    wo['FK|employee_id'] = employeeId
    wo.start_date = parseDateStringToUnix(entry.start_date)
    wo.end_date = parseDateStringToUnix(entry.end_date)
    wo.description = parseStringToDelta(entry.description)
    wo.status = entry.status || 'Upcoming'
    wo.notes = parseStringToDelta(entry.notes)
    wo.parking_info = parseStringToDelta(entry.parking_info)
    wo.bill_type = entry.bill_type
    wo.job_type = capFirst(entry.job_type)

    if (Object.keys(error).length) jobNumsNotInDb.push(error)
    return wo
  })

  woInterface.setData([...woData, ...newWos])
  setSheetValues({ sheetInterface: woInterface })
}

const createTasks = () => {
  const lineItemsInterface = getSheetInterface({ sheetName: 'line_items' })
  const lineItemData = lineItemsInterface.getData()
  const wsData = getSheetInterface({ sheetName: 'ws-li' }).getData()
  const wos = getSheetInterface({ sheetName: 'workorders' }).getData()

  const newLineitems = wsData.map((entry) => {
    const lineitem = {}
    lineitem.id = Utilities.getUuid()
    lineitem['FK|workorder_id'] = mapWoNumberToWoId(wos, entry.wo_number)
    lineitem.description = parseStringToDelta(entry.description)
    lineitem.details = parseStringToDelta(entry.details)
    lineitem.quantity = parseStringToDelta(entry.quantity)
    lineitem.hours = entry.hours
    lineitem.item_number = entry.item_number
    lineitem.completed = entry.completed
    lineitem.notes = parseStringToDelta(entry.notes)
    lineitem.created_at = +new Date()
    lineitem.updated_at = +new Date()
    lineitem.completed_at = ''

    return lineitem
  })

  lineItemsInterface.setData([...lineItemData, ...newLineitems])
  setSheetValues({ sheetInterface: lineItemsInterface })
}

const mapWoNumberToWoId = (wos, woNum) => {
  const wo = wos.find(wo => wo.wo_number === woNum)
  return wo?.id
}

const checkJobNumber = (wo, jobs) => {
  let result = { jobId: null, clientId: null, bidId: null }
  let error = {}
  // check for job number
  if (wo.job_number) {
    const job = jobs.find(job => job.job_number === wo.job_number)
    if (job) {
      result = {
        jobId: job.id,
        clientId: job['FK|client_id'],
        bidId: job['FK|bid_id'],
      }
    }

    if (!job) {
      error = {
        woNum: wo.wo_number,
        jobNum: wo.job_number,
      }
    }
  }

  return { result, error }
}

const checkContact = (wo, clientId) => {
  const contactsInterface = getSheetInterface({ sheetName: 'contacts' })
  const existingContacts = contactsInterface.getData()
  const res = []

  if (wo.contact) {
    // parse contact value
    const regex = /(?<name>[a-z ,.'-]+)?(?<number>[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6})(?<ext>[x+][0-9]+)?/gmi
    const matches = [...wo.contact.matchAll(regex)]

    const contacts = matches.map((match) => {
      const { name, number, ext } = match.groups
      return { name, number, ext }
    })

    // check contact name against existing, if exists return id, if not create new contact
    contacts.forEach((contact) => {
      const existingContact = existingContacts.find(item => normalize(item.name) === normalize(contact.name))
      if (existingContact)
        res.push(existingContact.id)

      if (!existingContact) {
        const phone = contact.ext ? `${contact.number} ${contact.ext}` : contact.number
        const newContact = {
          'id': Utilities.getUuid(),
          'FK|client_id': clientId,
          'name': titleCase(contact.name),
          'phone': phone,
          'email': '',
        }

        contactsInterface.setData([...existingContacts, newContact])
        setSheetValues({ sheetInterface: contactsInterface })

        res.push(newContact.id)
      }
    })
  }
  return res
}

const checkEmployee = (wo, employees) => {
  const res = { employeeId: null }
  if (wo.employee) {
    const employee = employees.find(employee => normalize(employee.name) === normalize(wo.employee))
    if (employee)
      res.employeeId = employee.id
  }

  return res
}

const titleCase = (string) => {
  if (!string) return

  const arr = string.split(' ')
  const formatted = arr.map(word => capFirst(word))
  return formatted.join(' ')
}

const normalize = (data) => {
  if (typeof data !== 'string') return
  return data.toLowerCase().trim().replace(/\s\s+/g, ' ')
}

const parseDateStringToUnix = (date) => {
  if (!date) return
  // get unix from date object
  const dateObj = new Date(date)
  return dateObj.getTime()
}

const parseStringToDelta = (string) => {
  if (!string) return ''
  return JSON.stringify({ ops: [{ insert: `${string}\n` }] })
}

const capFirst = (string) => {
  if (!string) return
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

const newWorkorder = {
  'id': '',
  'wo_number': null,
  'FK|job_id': '',
  'FK|bid_id': '',
  'FK|client_id': '',
  'FK|contact_id': '',
  'FK|employee_id': '',
  'start_date': null,
  'due_date': null,
  'description': '',
  'parking_info': '',
  'notes': '',
  'bill_type': '',
  'job_type': '',
  'created_at': +new Date(),
  'updated_at': null,
  'closed_at': null,
  'status': 'Upcoming',
}

