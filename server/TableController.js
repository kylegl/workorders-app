class TableController {
  constructor({ tableName, data }) {
    this.tableName = tableName
    this.data = data
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
      Table.tableInterface.filterRows((row, properties) => row.id !== entry.id)
    })

    return this.commitTransaction({ Table })
  }

  get() {
    const Table = this.startTransaction()

    this.unlock()
    return Table
  }

  isLocked() {
    const prop = getScriptProp({ prop: `${this.tableName}_locked` })
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
    return { data: Table.data, version: uuid, table: this.tableName }
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
