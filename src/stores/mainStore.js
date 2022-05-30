import { defineStore } from 'pinia'
import { Mutation, Query } from '~/api/index'

export const useMainStore = defineStore('main', {
  state: () => ({
    data: {
      employees: [],
    },
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
  }),
  getters: {
  },
  actions: {
    async query() {
      try {
        this.loading = true
        const res = await Query()

        const isDev = process.env.NODE_ENV === 'development'

        const tableNames = Object.keys(res)
        tableNames.forEach((name) => {
          this.data[name] = isDev ? res[name] : res[name].data
          this.client.versions[name] = isDev ? '' : res[name].version
        })

        this.loading = false
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
