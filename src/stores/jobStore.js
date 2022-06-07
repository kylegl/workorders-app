import { defineStore } from 'pinia'
import { useMainStore } from './mainStore'

export const useJobStore = defineStore('jobList', {
  state: () => ({
    jobs: [],
    loading: true,
    error: undefined,
  }),
  getters: {
    mainStore: () => useMainStore(),
  },
  actions: {
    async fetchJobs() {
      try {
        this.loading = true
        this.mainStore.query()
        this.jobs = this.mainStore.data?.jobs ?? []
        this.loading = false
      }
      catch (err) {
        this.error = 'I\'m had trouble finding the jobs'
        this.loading = false
      }
    },
  },
})
