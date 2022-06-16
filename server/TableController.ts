interface TableControllerType {
  tableName: TableName
  data: Array<any>
  version: Version
  add(): TableResponse
  delete(): TableResponse
  get(): TableResponse
  update(): TableResponse
}

interface TableResponse {
  data: Object
  version: string
  table: string
}

interface Database {
  employees: Array<any>
  contacts: Array<any>
  clients: Array<any>
  bids: Array<any>
  jobs: Array<any>
  workorders: Array<any>
  line_items: Array<any>
}

type TableName = keyof Database

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class TableController implements TableControllerType {
  tableName
  data
  version
  constructor({ tableName, data, version }: { tableName: TableName; data: Array<any>; version: Version }) {
    this.tableName = tableName
    this.data = data
    this.version = version
  }

  add() {
    const Table = this.startTransaction()

    this.data.forEach((entry) => {
      Table.data.push(entry)
    })

    return this.commitTransaction({ Table })
    // check queue for any waiting transtactions
  }

  delete() {
    const Table = this.startTransaction()

    this.data.forEach((entry) => {
      Table.tableInterface.filterRows((row: Object, properties) => row.id !== entry.id)
    })

    return this.commitTransaction({ Table })
  }

  get() {
    const Table = this.startTransaction()

    this.unlock()
    return { data: Table.data, version: this.version, table: this.tableName }
  }

  update() {
    const Table = this.startTransaction()

    this.data.forEach((entry) => {
      const item = Table.data.find((row: Object, properties) => row.id === entry.id)

      if (item)
        Table.tableInterface.filterRows((row: Object, properties) => row.id !== entry.id)

      Table.data.push(entry)
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
    wait({ condition: this.isLocked() })
    this.lock()

    return this.getTableInterface()
  }

  commitTransaction({ Table }) {
    Table.setTableValues()
    const { uuid } = setTableVersion({ table: this.tableName })
    setTableVersion({ table: 'main' })
    this.unlock()
    // return { data: Table.data, version: uuid, table: this.tableName }
    return { ok: true }
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
