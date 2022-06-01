import { defineStore } from 'pinia'
import { Mutation, Query } from '~/api/index'
import { useClientStore } from '~/stores/clientStore'
import { useContactStore } from '~/stores/contactStore'
import { useJobStore } from '~/stores/jobStore'
import { useEmployeeStore } from '~/stores/employeeStore'
import { useBidStore } from '~/stores/bidStore'
import { useLineItemStore } from '~/stores/lineItemStore'
import { useWorkorderStore } from '~/stores/workorderStore'

export const useMainStore = defineStore('main', {
  state: () => ({
    data: {
      employees: [],
    },
    client: {
      versions: {
        main: undefined,
        workorders: undefined,
        lineItems: undefined,
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
    distrubuteData: (state) => {
      const stores = {
        jobs: useJobStore(),
        clients: useClientStore(),
        contacts: useContactStore(),
        employees: useEmployeeStore(),
        bids: useBidStore(),
        lineItems: useLineItemStore(),
        workorders: useWorkorderStore(),
      }

      Object.keys(stores).forEach((key) => {
        const store = stores[key]
        store[key] = state.data?.[key]
      })
    },
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
