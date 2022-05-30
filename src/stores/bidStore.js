import { defineStore } from 'pinia'
import { useMainStore } from './mainStore'

export const useBidStore = defineStore('bidList', {
  state: () => ({
    bids: [],
    loading: true,
    error: undefined,
  }),
  getters: {
    mainStore: () => useMainStore(),
  },
  actions: {
    async fetchBids() {
      try {
        this.loading = true
        this.mainStore.query()
        this.bids = this.mainStore.data?.bids ?? []
        this.loading = false
      }
      catch (err) {
        this.error = 'I\'m had trouble finding the bids'
        this.loading = false
      }
    },
  },
})
