import { isDate } from 'util/types'
import { defineStore } from 'pinia'
import type { ApiResponse, BackendData, Versions } from '../api/apiResponseTypes'
import { Mutation, Query } from '~/api/index'

interface GetParams {
  id?: string | number
  type: string
  getParsed?: boolean
}

const isId = (storeKeys: string[], key: string): string | undefined => {
  const [,type] = key.match(/^([^_]+)_(id)$/) ?? []
  const pluralType = `${type}s`
  return storeKeys.includes(pluralType) ? pluralType : undefined
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
      } as Versions,
    },
    loading: true,
    error: undefined,
  }),
  getters: {
    getByType(state) {
      return ({ type, getParsed = false }: GetParams) => {
        const data = state.data[type]
        if (!getParsed) return data
        // TODO Changing this to just return parsed values
        return data.map(row => this.formatRowData({ row }))
      }
    },
    getStoreDataKeys: state => Object.keys(state.data),
    getById(state) {
      return ({ id, type, getParsed = false }: GetParams) => {
        const row = state.data[type].find(entry => entry.id === id)
        return getParsed
          ? this.formatRowData({ row })
          : row
      }
    },
    formatRowData(state) {
      return ({ row }) => {
        const storeKeys = this.getStoreDataKeys

        const parsedRow = Object.keys(row).reduce((result, key) => {
          const type = isId(storeKeys, key)

          if (type) {
          // TODO fix the bids data. id format is wrong
            if (type === 'bids') return result
            const id = row[key]
            const entry = this.getById({ id, type })
            result[key] = entry
          }

          const isDateType = isDate(key)
          if (isDateType)
            result[key] = row[key] ? parseTimestampToInputFormat(row[key]) : row[key]

          if (!isDateType && !type) result[key] = row[key]
          return result
        }, {})
        return parsedRow
      }
    },

  },
  actions: {
    async query() {
      try {
        this.loading = true
        const res = await Query()
        const isDev = process.env.NODE_ENV === 'development'

        const tableNames = Object.keys(res)
        tableNames.forEach((key) => {
          this.data[key] = isDev ? res[key] : res[key].data
          this.client.versions[key] = isDev ? '' : res[key].version
        })

        this.loading = false
        this.error = undefined
      }
      catch (err) {
        this.error = err
        this.loading = false
      }
    },
    async mutation({ items }) {
      const res = await Mutation({ items })
      return res
    },
  },
})
