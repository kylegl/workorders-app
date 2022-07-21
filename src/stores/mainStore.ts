import { defineStore } from 'pinia'
import { Query } from '~/api/index'
import type { Data, DataType, StoreData, TableKey, TableRowKey, TableRowType, Version, VersionKeys } from '~/types'
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
    }),
    loading: true,
    error: undefined,
  }),
  getters: {
    getByType(state) {
      return ({ type, getParsed = false }: GetByTypeParams) => {
        const data = state.data?.[type as keyof Data]

        if (!getParsed) return data
        return data?.map(row => this.formatRowData({ row }))
      }
    },
    getById(state) {
      return ({ id, type, getParsed = false }: GetByIdParams) => {
        const row = state.data?.[type as keyof Data]?.find(entry => entry.id.toString() === id?.toString())
        return getParsed && row
          ? this.formatRowData({ row })
          : row
      }
    },
    getByKeyValue(state) {
      return ({ key, value, type, getParsed }: GetKeyParams) => {
        const results = state.data?.[type]?.filter((entry: TableRowType) => entry[key] === value)
        return getParsed
          ? results.map(row => this.formatRowData({ row }))
          : results
      }
    },
    formatRowData() {
      return ({ row }: { row: TableRow }): TableRow | {} => {
        const rowKeys = Object.keys(row) as TableRowKey[]
        const parsedRow: DataTableParsed | {} = rowKeys.reduce<ReduceReturnType>((result, key) => {
          const isForeignKey: TableRowKey | undefined = isFK(key)

          if (isForeignKey) {
            const id = row[key]
            const entry = this.getById({ id, type: isForeignKey }) as DataTable
            result[key] = entry
          }

          const isDateType = isDate(key)
          if (isDateType)
            result[key] = row[key] ? unixToHumanDate(row[key]) : row[key]

          if (!isDateType && !isForeignKey) result[key] = row[key]
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
    async query(): Promise<void> {
      try {
        this.loading = true
        const res = await Query(this.versions)
        if (!res?.ok) throw new Error('No response from API')

        const { data, versions } = res

        if (data) {
          const tableNames = Object.keys(data) as TableKey[]

          tableNames.forEach((key: TableKey) => {
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
  data?: TableRowType
  table: TableKey
  localOnly?: boolean
}
export interface GetByIdParams {
  id: string
  type: TableKey
  getParsed?: boolean
}
export interface GetByTypeParams {
  type: TableKey
  getParsed?: boolean
}

export interface GetKeyParams {
  key: string
  type: TableKey
  value: string | number | boolean
  getParsed?: boolean
}
