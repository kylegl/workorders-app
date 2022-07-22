/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
const syncFromLegacyDB = () => {
  const DBValues = getLegacyDb()
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

function getLegacyDb() {
  return SpreadsheetApp.openById('1FY1m2zRekFtB8mfBlkS1WXvyQ-0V_AOq6EIiuGySXs8')
    .getSheetByName('DB')
}

function getLegacyDbVersion() {
  return getLegacyDb().getRange('A1').getValue()
}

function pollLegacyDb() {
  const legacyVersion = getScriptProp('legacydb')
  const currentLegacydbVersion = getLegacyDbVersion()

  if (legacyVersion !== currentLegacydbVersion) {
    syncFromLegacyDB()

    scriptPropService()
      .setProperties({
        legacydb: currentLegacydbVersion,
        clients: getUuid(),
        bids: getUuid(),
        jobs: getUuid(),
      })
  }
}
