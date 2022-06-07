import { defineStore } from 'pinia'
import { useMainStore } from '~/stores/mainStore'

export const useClientStore = defineStore('clientList', {
  state: () => ({
    clients: [],
    loading: true,
    error: undefined,
  }),
  getters: {
    mainStore: () => useMainStore(),
    // getById: state => id => state.clients.find(entry => entry.id === id),
  },
  actions: {
    async fetchClients() {
      try {
        this.loading = true
        this.mainStore.query()
        this.clients = this.mainStore.data?.clients ?? []
        this.loading = false
      }
      catch (err) {
        this.error = 'I\'m had trouble finding the clients'
        this.loading = false
      }
    },
  },
})
