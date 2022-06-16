interface DatabaseController {
  clientVersions: Versions
  get(): Package
  add(): Package
}

type Package = Record<keyof Tables, Pack>

interface Pack {
  version: Version
  name: string
  id: string | number
  data: Array<any>
}

class DatabaseController {
  clientVersions
  constructor({ clientVersions }: { clientVersions: Versions }) {
    this.clientVersions = clientVersions
  }

  get() {
    this.startTransaction()
    const scriptProps = getScriptProps()

    let res = {
      main: {
        version: undefined,
      },
    }
    if (!this.isInSync({ scriptProps })) {
      const tables = this.getTablesThatNeedUpdates({ scriptProps })
      if (tables.length)
        res = this.getTables({ tables })
    }

    res.main = { version: scriptProps.main }
    return this.commitTransaction({ res })
  }

  add({ tableName, data, version }) {
    this.startTransaction()
    const scriptProps = getScriptProps()
    const tableController = new TableController({ tableName, data, version })
    const actionRes = tableController.add()
    if (!actionRes.ok) console.log('error adding entry')

    let res = {
      main: {
        version: undefined,
      },
    }
    if (!this.isInSync({ scriptProps })) {
      const tables = this.getTablesThatNeedUpdates({ scriptProps })
      res = this.getTables({ tables })
    }

    res.main = { version: scriptProps.main }
    return this.commitTransaction({ res })
  }

  // helpers
  isInSync({ scriptProps }) {
    const serverVersions = scriptProps
    if (this.clientVersions.main === serverVersions.main) return true
    return Object
      .keys(this.clientVersions)
      .every(item => this.clientVersions[item as keyof Versions] === serverVersions[item])
  }

  getTablesThatNeedUpdates({ scriptProps }) {
    const serverVersions = scriptProps
    if (this.clientVersions.main === serverVersions.main) return []

    return Object.keys(this.clientVersions)
      .filter(item => this.clientVersions[item as keyof Versions] !== serverVersions[item])
      .filter(item => item !== 'main')
  }

  getTables({ tables }) {
    const packs = tables.reduce((res, table) => {
      res[table] = packer({ table })
      return res
    }, {})

    return packs
  }

  startTransaction() {
    wait({ condition: this.isLocked() })
    this.lock()
  }

  commitTransaction({ res }) {
    this.unlock()
    return res
  }

  isLocked() {
    getScriptProp({ prop: 'main_locked' })
  }

  lock() {
    setScriptProp({ key: 'main_locked', value: true })
  }

  unlock() {
    setScriptProp({ key: 'main_locked', value: false })
  }
}
