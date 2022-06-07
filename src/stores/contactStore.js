import { defineStore } from 'pinia'
import { useUid } from '../composables/uuid'
import { useMainStore } from './mainStore'

export const useContactStore = defineStore('contactList', {
  state: () => ({
    contacts: [],
    loading: true,
    error: undefined,
  }),
  getters: {
    mainStore: () => useMainStore(),
  },
  actions: {
    async fetchContacts() {
      try {
        this.loading = true
        this.mainStore.query()
        this.contacts = this.mainStore.data.contacts ?? []
        this.loading = false
      }
      catch (err) {
        this.error = 'I\'m had trouble finding the contacts'
        this.loading = false
      }
    },
    async addContact({ contact }) {
      contact.id = useUid()
      this.contacts.push(contact)

      const item = {
        namespace: 'table',
        action: 'add',
        params: { tableName: 'contacts', data: [contact] },
      }
      const req = await this.mainStore.mutation({ items: [item] })
    },
    async deleteEmployee({ contact }) {
      this.contacts = this.contacts.filter(currentEmployee => contact.id !== currentEmployee.id)

      const item = {
        namespace: 'table',
        action: 'delete',
        params: { tableName: 'contacts', data: [contact] },
      }

      const req = await this.mainStore.mutation({ items: [item] })
    },
  },
})
