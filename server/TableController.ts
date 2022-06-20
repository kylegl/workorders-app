// eslint-disable-next-line @typescript-eslint/no-unused-vars
class TableController {
  tableName
  version
  constructor({ tableName, version }: { tableName: string; version: string | undefined }) {
    this.tableName = tableName
    this.version = version
  }

  add(data: TableData) {
    const Table = this.startTransaction()

    data.forEach((entry) => {
      Table.data.push(entry)
    })

    return this.commitTransaction({ Table })
    // check queue for any waiting transtactions
  }

  delete(data: TableData) {
    const Table = this.startTransaction()

    data.forEach((entry: TableRow) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Table.tableInterface.filterRows((row: TableRow, properties: any) => row.id !== entry.id)
    })

    return this.commitTransaction({ Table })
  }

  get() {
    const Table = this.startTransaction()

    this.unlock()
    return { data: Table.data, version: this.version, table: this.tableName }
  }

  update(data: TableData) {
    const Table = this.startTransaction()

    data.forEach((entry) => {
      const i = Table.data.findIndex((row: TableRow) => row.id === entry.id)

      if (i !== -1)
        Table.data[i] = { ...entry }
    })

    return this.commitTransaction({ Table })
  }

  isLocked() {
    return getScriptProp({ prop: `${this.tableName}_locked` })
  }

  lock() {
    setScriptProp({ key: `${this.tableName}_locked`, value: true })
  }

  unlock() {
    setScriptProp({ key: `${this.tableName}_locked`, value: false })
  }

  startTransaction() {
    wait(this.isLocked())
    this.lock()

    return this.getTableInterface()
  }

  commitTransaction({ Table }: any): TableTransactionResponse {
    Table.setTableValues()

    const uuid: string = setTableVersion({ table: this.tableName })

    setTableVersion({ table: 'main' })

    this.unlock()

    // const formatData = Table.data.map(row => ({ ...row, type: this.tableName }))

    return { ok: true, data: Table.data, version: uuid, table: this.tableName }
  }

  getTableInterface() {
    const tableInterface = getSheetInterface({ sheetName: this.tableName })

    return {
      version: getScriptProp({ prop: this.tableName }),
      data: tableInterface.getData(),
      setTableValues: () => {
        const outputRange = tableInterface.getRange()

        outputRange.getSheet().clearContents()

        tableInterface
          .getRange(outputRange)
          .setValues(tableInterface.createValues())
      },
      tableInterface,
    }
  }
}

interface Employee {
  id: string
  name: string
  position?: string
  email?: string
  phone?: number
}

interface Workorder {
  'id': string
  'FK|client_id': string
  'FK|employee_id'?: string
  'FK|contact_id'?: string
  'FK|job_id'?: string
  'FK|bid_id'?: string
  'start_date'?: number
  'due_date'?: number
  'description'?: string
  'parking_info'?: string
  'notes'?: string
  'bill_type'?: string
  'job_type'?: string
  'created_at'?: number
  'udpated_at'?: number
  'closed_at'?: number
  'status': string
}

interface Job {
  'id': string
  'FK|client_id': string
  'FK|contact_id'?: string
  'job_number': number
  'prevailing_wage': boolean
  'job_folder_id': string
  'address'?: string
  'job_name'?: string
  'status': string
  'billing_type': string
  'closed_date'?: number
}

interface Bid {
  'id': string
  'FK|client_id': string
  'FK|contact_id'?: string
  'bid_id': string
  'prevailing_wage': boolean
  'bid_folder_id'?: string
  'address'?: string
  'job_name'?: string
  'status': string
  'billing_type': string
  'sent_date'?: number
  'speadsheet_id'?: string
  'bid_item'?: string
  'total'?: number
}

interface Contact {
  'id': string
  'name': string
  'email'?: string
  'FK|client_id'?: string
  'phone'?: number
}

interface Client {
  id: string
  name: string
  email?: string
  phone?: number
  address?: string
}

interface Lineitem {
  id: string
  'FK|workorder_id': string
  'description'?: string
  'details'?: string
  'quantity'?: string
  'hours': number
  'item_number': number
  'completed': boolean
}

type TableRow = Employee | Workorder | Job | Bid | Contact | Client | Lineitem

type TableData =
  | Employee[]
  | Contact[]
  | Client[]
  | Bid[]
  | Job[]
  | Workorder[]
  | Lineitem[]

interface TableTransactionResponse {
  ok: boolean
  data: TableData
  version: string
  table: string
}

