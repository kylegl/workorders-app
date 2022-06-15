class DatabaseController {
  constructor({ clientVersions }) {
    this.clientVersions = clientVersions
  }

  get() {
    this.startTransaction()
    const scriptProps = getScriptProps()

    let res = {}
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
      .every(item => this.clientVersions[item] === serverVersions[item])
  }

  getTablesThatNeedUpdates({ scriptProps }) {
    const serverVersions = scriptProps
    return Object.keys(this.clientVersions)
      .filter(item => this.clientVersions[item] !== serverVersions[item])
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
