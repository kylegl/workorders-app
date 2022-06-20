// eslint-disable-next-line @typescript-eslint/no-unused-vars
class DatabaseController {
  clientVersions
  constructor({ clientVersions }: { clientVersions: Versions }) {
    this.clientVersions = clientVersions
  }

  get() {
    try {
      this.startTransaction()

      return this.commitTransaction(true)
    }
    catch (err) {
      this.errorHandler(err)
    }
  }

  add({ table, data }: MutateParams) {
    try {
      const tableController = this.startTransaction({ table })

      if (!tableController)
        throw new Error(`table ${table} not found`)

      const actionRes = tableController!.add(data)

      if (!actionRes.ok)
        throw new Error(`error adding entry: ${data} to table ${table}`)

      return this.commitTransaction(true)
    }
    catch (err) {
      this.errorHandler(err)
    }
  }

  update({ table, data }: MutateParams) {
    try {
      const tableController = this.startTransaction({ table })
      const actionRes = tableController!.update(data)

      if (!actionRes.ok)
        throw new Error(`error updating entry: ${data} to table ${table}`)

      return this.commitTransaction(true)
    }
    catch (err) {
      this.errorHandler(err)
    }
  }

  delete({ table, data }: MutateParams) {
    try {
      const tableController = this.startTransaction({ table })
      const actionRes = tableController!.delete(data)

      if (!actionRes.ok)
        throw new Error(`error deleting entry: ${data} to table ${table}`)

      return this.commitTransaction(true)
    }
    catch (err) {
      this.errorHandler(err)
    }
  }

  // helpers
  getChangedTables() {
    const serverVersions = getScriptProps()
    const versions = this.getVersions(serverVersions)

    if (this.clientVersions.main === serverVersions.main)
      return { data: {}, versions }

    const tables = Object.keys(this.clientVersions)
      .filter(item => this.clientVersions[item] !== serverVersions[item])
      .filter(item => item !== 'main')

    const data = tables.length ? this.getTables(tables) : {}

    return { data, versions }
  }

  getTables(tables: string[]) {
    const packs = tables.reduce((res: Packs, table) => {
      res[table] = packer({ table })
      return res
    }, {})

    return packs
  }

  getVersions(props: Record<string, string>) {
    return Object.keys(props).reduce((res: Record<string, string>, prop) => {
      const isVersionProp = prop.match(/^((?!locked)[\s\S])*$/)
      if (isVersionProp)
        res[prop] = props[prop]

      return res
    }, {})
  }

  startTransaction({ table }: StartTransactionParams = {}) {
    wait(this.isLocked())
    this.lock()
    const version = this.clientVersions[table]

    return table ? new TableController({ table, version }) : undefined
  }

  commitTransaction(ok: boolean) {
    this.unlock()

    const { data, versions } = this.getChangedTables()

    const res = {
      ok,
      data,
      versions,
    }

    return res as DatabaseControllerResponse
  }

  isLocked(): boolean {
    return JSON.parse(getScriptProp({ prop: 'main_locked' }))
  }

  lock() {
    setScriptProp({ key: 'main_locked', value: true })
  }

  unlock() {
    setScriptProp({ key: 'main_locked', value: false })
  }

  errorHandler(err: any) {
  // eslint-disable-next-line no-console
    console.error(err)
    return this.commitTransaction(false)
  }
}

interface DatabaseControllerResponse {
  ok: boolean
  data: any
  versions: Record<string, string | undefined>
}

interface StartTransactionParams {
  table?: string
  version?: string | undefined
}

interface Pack {
  version: string
  table: string
  data: Array<any>
}

type Packs = Record<string, Pack>

interface MutateParams {
  table: string
  data: TableData
  version: string | undefined
}
