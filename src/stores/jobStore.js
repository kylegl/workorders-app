import { defineStore } from 'pinia'

export const useJobStore = defineStore('jobList', {
  state: () => ({
    jobs: [],
    loading: false,
    error: undefined,
  }),
  getters: {
    getById: state => id => state.jobs.find(entry => entry.id === id),
  },
})
