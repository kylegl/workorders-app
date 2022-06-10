import { defineStore } from 'pinia'
import type { BackendData, DataTable, DataTableName, DataTableParsed, DataTables, TableRowKeys, Versions } from '~/api/apiResponseTypes'
import { Mutation, Query } from '~/api/index'

// Helper functions
const isFK = (key: string): DataTableName | undefined => {
  const [,,type] = key.match(/^(FK\|)([^_]+)_(id)$/) ?? []
  return type ? `${type}s` as DataTableName : undefined
}

const isDate = (key: string) => /^([^_]+)_(date|at)$/.test(key)

export const useMainStore = defineStore('main', {
  state: () => ({
    data: {},
    client: {
      versions: {
        main: undefined,
        workorders: undefined,
        line_items: undefined,
        contacts: undefined,
        employees: undefined,
        clients: undefined,
        bids: undefined,
        jobs: undefined,
      },
    },
    loading: true,
    error: undefined,
  } as RootState),
  getters: {
    getByType(state) {
      return ({ type, getParsed = false }: GetParams): DataTables => {
        const data = state.data?.[type] as DataTables

        if (!getParsed) return data
        return data?.map(row => this.formatRowData({ row }))
      }
    },
    getById(state) {
      return ({ id, type, getParsed = false }: GetParams) => {
        const row: DataTable = state.data?.[type]?.find((entry: DataTable) => entry.id === id)
        return getParsed && row
          ? this.formatRowData({ row })
          : row
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
            result[key] = row[key] ? parseTimestampToDate(row[key]) : row[key]

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
        const res = await Query()
        const isDev = process.env.NODE_ENV === 'development'

        const tableNames: DataTableName[] = Object.keys(res) as (keyof typeof res)[]
        tableNames.forEach((key) => {
          this.data[key] = isDev ? res[key] : res[key].data
          this.client.versions[key] = isDev ? '' : res[key].version
        })

        this.loading = false
        this.error = undefined
      }
      catch (err) {
        this.error = getErrorMessage(err)
        this.loading = false
      }
    },
    async mutation({ items }) {
      const res = await Mutation({ items })
      return res
    },
  },
})

// Types
interface GetParams {
  id?: string
  type: DataTableName
  getParsed?: boolean
}

interface RootState {
  data: BackendData
  client: {
    versions: Versions
  }
  loading: boolean
  error?: string
}

interface FormatRowParams {
  row: DataTable
}

export type ReduceReturnType = Record<TableRowKeys, DataTable> | {}

interface TimestampParam {
  timestamp: number | undefined
  readable: Date | string | undefined
}
