import { defineStore } from 'pinia'
import { Mutation, Query } from '~/api/index'
import type { Data, DataType, StoreData, TableKey, TableKeys, Version, VersionKeys } from '~/types'
import { mutationValidator, versionValidator } from '~/types'

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
      return ({ type, getParsed = false }) => {
        const data = state.data?.[type as keyof Data]

        if (!getParsed) return data
        return data?.map(row => this.formatRowData({ row }))
      }
    },
    getById(state) {
      return ({ id, type, getParsed = false }) => {
        const row = state.data?.[type as keyof Data]?.find(entry => entry.id.toString() === id?.toString())
        return getParsed && row
          ? this.formatRowData({ row })
          : row
      }
    },
    getByKeyValue(state) {
      return ({ key, value, type }: GetKeyParams) => {
        const results = state.data?.[type]?.filter((entry: DataTable) => entry[key] === value)
        return results ?? []
      }
    },
    formatRowData() {
      return ({ row }: FormatRowParams): DataTable | {} => {
        const rowKeys = Object.keys(row) as TableRowKeys[]
        const parsedRow: DataTableParsed | {} = rowKeys.reduce<ReduceReturnType>((result, key) => {
          const isForeignKey: DataTableName | undefined = isFK(key)

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
      return ({ timestamp, readable }: TimestampParam): Date | string | undefined => {
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
    async mutation(table: string, action: string, data?: DataType) {
      const mutation = mutationValidator.parse({
        table,
        action,
        data,
        versions: this.versions,
      })

      const res = await Mutation([mutation])
      return res
    },
    async deleteById({ id, table }: MutationParams) {
      if (this.data?.[table])
        this.data[table] = this.data[table]!.filter((el: DataType) => el.id !== id)

      const res = await this.mutation(table, 'delete')

      console.log(`Delete request for ${table}: ${id}, res = ${res}`)
    },
    async addItem({ item, table }: MutationParams) {
      if (this.data?.[table])
        this.data[table] = [...this.data[table], item]

      const res = await this.mutation(table, 'add', item)
      console.log(`Add response:  ${res}}, res = ${res}`)
    },
    async update({ item, table }: MutationParams) {
      if (this.data?.[table]) {
        let entry = this.data[table]!.find((el: DataType) => el.id === item.id)
        if (entry)
          entry = { ...item }
      }

      const res = await this.mutation(table, 'update', item)
      console.log(`update response: ${res}}`)
    },
  },
})

// Types
interface MutationParams {
  id?: string
  item?: DataType
  table: TableKeys
}
