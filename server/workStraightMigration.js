/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-undef */
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
