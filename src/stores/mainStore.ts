import { defineStore } from 'pinia'
import { Query } from '~/api/index'
import type { DataEntryKeyType, DataEntryType, DataType, StoreData, StoreDataKey, Version, VersionKeys } from '~/types'
import { versionValidator } from '~/types'

export const useMainStore = defineStore('main', {
  state: (): { data: StoreData; versions: Version; loading: boolean; error: any } => ({
    data: {},
    versions: versionValidator.parse({
      main: undefined,
      workorders: undefined,
      line_items: undefined,
      contacts: undefined,
      employees: undefined,
      clients: undefined,
      bids: undefined,
      jobs: undefined,
      properties: undefined,
    }),
    loading: true,
    error: undefined,
  }),
  getters: {
    getByType(state) {
      return ({ type, getParsed = false }: GetByTypeParams) => {
        const data = state.data?.[type]

        if (!getParsed) return data
        return data?.map(row => this.formatRowData({ row }))
      }
    },
    getById(state) {
      return ({ id, type, getParsed = false }: GetByIdParams) => {
        const list = state.data?.[type]
        if (!list || !list.length)
          return undefined

        const row = list?.find(entry => entry.id.toString() === id?.toString())

        return getParsed && row
          ? this.formatRowData({ row })
          : row
      }
    },
    getByKeyValue(state) {
      return ({ key, value, type, getParsed }: GetKeyParams) => {
        const data = state.data?.[type]
        if (data) {
          const results = data.filter((entry: DataEntryType) => entry[key] === value)

          return getParsed
            ? results.map(row => this.formatRowData({ row }))
            : results
        }
      }
    },
    formatRowData() {
      return ({ row }: { row: TableRow }): TableRow | {} => {
        const rowKeys = Object.keys(row) as StoreDataKey[]
        const parsedRow = rowKeys.reduce((result, key) => {
          const { isForeignKey, name } = isFK(key)

          if (isForeignKey) {
            const value = row[key]

            if (Array.isArray(value)) {
              if (value.length) {
                const entries = value.map(id => this.getById({ id, type: name }))
                result[key] = entries
                return result
              }

              if (!value.length)
                result[key] = value
              return result
            }

            if (value) {
              result[key] = this.getById({ id: value, type: name })
              return result
            }

            if (!value) {
              result[key] = value
              return result
            }
          }

          if (!isForeignKey) result[key] = row[key]
          return result
        }, {})
        return parsedRow
      }
    },
    getReadableDate() {
      return ({ timestamp, readable }: { timestamp: number; readable: string }): void => {
        return useConvertSyncRefs(timestamp, readable, unixToDate, dateToUnix)
      }
    },

  },
  actions: {
    async query(path: string): Promise<void> {
      try {
        this.loading = true
        const res = await Query(this.versions, path)
        if (!res?.ok) throw new Error('No response from API')

        const { data, versions } = res

        if (data) {
          const tableNames = Object.keys(data) as StoreDataKey[]

          tableNames.forEach((key: StoreDataKey) => {
            this.data[key] = data?.[key]?.data
          })
        }

        if (versions) {
          const versionNames = Object.keys(versions) as VersionKeys[]

          versionNames.forEach((key) => {
            this.versions[key] = versions?.[key]
          })
        }

        this.loading = false
        this.error = undefined
      }
      catch (err) {
        this.error = getErrorMessage(err)
        this.loading = false
      }
    },
    async deleteById({ data, table, localOnly }: MutationParams): Promise<void> {
      if (this.data?.[table])
        this.data[table] = this.data[table]!.filter((el: DataType) => el.id !== data.id)
      if (!localOnly)
        mutation(table, 'delete', data, this.versions)
    },
    async addItem({ data, table }: MutationParams) {
      if (this.data?.[table])
        this.data[table]?.push(data)

      const res = await mutation(table, 'add', data, this.versions)
    },
    async update({ data, table }: MutationParams) {
      const res = await mutation(table, 'update', data, this.versions)
    },
  },
})

// Types
export interface MutationParams {
  id?: string
  data?: DataEntryType
  table: StoreDataKey
  localOnly?: boolean
}
export interface GetByIdParams {
  id: string
  type: StoreDataKey
  getParsed?: boolean
}
export interface GetByTypeParams {
  type: StoreDataKey
  getParsed?: boolean
}

export interface GetKeyParams {
  key: DataEntryKeyType
  type: StoreDataKey
  value: string | number | boolean
  getParsed?: boolean
}
