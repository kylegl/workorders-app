import { defineStore } from 'pinia'
import { useMainStore } from './mainStore'

export const useWorkorderStore = defineStore('workorderList', {
  state: () => ({
    workorders: [],
    loading: true,
    error: undefined,
  }),
  getters: {
    mainStore: () => useMainStore(),
  },
  actions: {
    async fetchWorkorders() {
      try {
        this.loading = true
        await this.mainStore.query()
        this.workorders = this.mainStore.data?.workorders ?? []
        this.loading = false
      }
      catch (err) {
        this.error = 'I\'m had trouble finding the workorders'
        this.loading = false
      }
    },
  },
})
