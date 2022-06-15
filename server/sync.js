const syncFromMainDB = () => {
  const DBValues = SpreadsheetApp.openById('1FY1m2zRekFtB8mfBlkS1WXvyQ-0V_AOq6EIiuGySXs8')
    .getSheetByName('DB')
    .getDataRange()
    .getValues()

  DBValues.shift()

  const DB = new cUseful.Fiddler().setValues(DBValues).getData()
  const clients = getSheetInterface({ sheetName: 'clients' }).getData()
  const contacts = getSheetInterface({ sheetName: 'contacts' }).getData()

  const bids = DB.filter(entry => entry.status)
  const jobs = DB.filter(entry => entry.job_id)

  syncBids({ bids, contacts, clients })
  syncJobs({ jobs, contacts, clients })
}

const syncJobs = ({ jobs, contacts, clients }) => {
  const jobsInterface = getSheetInterface({ sheetName: 'jobs' })
  const jobData = jobsInterface.getData()
  const headers = jobsInterface.getHeaders()

  const idErrors = []

  const updatedJobs = jobs.map((entry) => {
    const existingEntry = jobData.find(item => item.job_number === entry.job_id)
    const id = existingEntry?.id ?? Utilities.getUuid()
    const client_id = existingEntry?.['FK|client_id'] ?? clients.find(client => client.name.trim() === entry.company.trim())?.id
    const contact_id = existingEntry?.['FK|contact_id'] ?? contacts.find(contact => contact.name.trim() === entry.contact.trim())?.id

    const job = {
      id,
      client_id,
      contact_id,
      billing_type: entry.tm,
      contract_total: entry.job_total,
      job_type: entry.finishing,
      status: entry.job_status,
      sheet_id: entry.job_sheet_id,
      closed_date: entry.job_closed_date,
      job_number: entry.job_id,
    }

    headers.filter(item => ![
      'id',
      'FK|client_id',
      'FK|contact_id',
      'billing_type',
      'contract_total',
      'job_type',
      'status',
      'sheet_id',
      'closed_date',
      'job_number',
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
    const id = existingEntry?.id ?? Utilities.getUuid()
    const client_id = existingEntry?.['FK|client_id'] ?? clients.find(client => client.name.trim() === entry.company.trim())?.id
    const contact_id = existingEntry?.['FK|contact_id'] ?? contacts.find(contact => contact.name.trim() === entry.contact.trim())?.id

    const bid = {
      id,
      'FK|client_id': client_id,
      'FK|contact_id': contact_id,
      billing_type: entry.tm,
    }

    headers.filter(item => !['id', 'FK|client_id', 'FK|contact_id', 'billing_type'].includes(item)).forEach((el) => {
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
