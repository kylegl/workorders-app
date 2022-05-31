import { defineStore } from 'pinia'
import { useMainStore } from './mainStore'

export const useLineItemStore = defineStore('lineItemList', {
  state: () => ({
    line_items: [],
    loading: true,
    error: undefined,
  }),
  getters: {
    mainStore: () => useMainStore(),
  },
  actions: {
    async fetchLineItems() {
      try {
        this.loading = true
        await this.mainStore.query()
        this.line_items = this.mainStore.data?.line_items ?? []
        this.loading = false
      }
      catch (err) {
        this.error = 'I\'m had trouble finding the lineItems'
        this.loading = false
      }
    },
  },
})
