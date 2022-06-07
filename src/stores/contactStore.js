import { defineStore } from 'pinia'
import { useMainStore } from './mainStore'
import { useUid } from '~/composables'

export const useContactStore = defineStore('contactList', {
  state: () => ({
    contacts: [],
    loading: false,
    error: undefined,
  }),
  getters: {
    getById: state => id => state.contacts.find(entry => entry.id === id),
  },
  actions: {
    async addContact({ contact }) {
      const mainStore = useMainStore()
      contact.id = useUid()
      this.contacts.push(contact)

      const item = {
        namespace: 'table',
        action: 'add',
        params: { tableName: 'contacts', data: [contact] },
      }
      const req = await mainStore.mutation({ items: [item] })
    },
    async deleteEmployee({ contact }) {
      const mainStore = useMainStore()
      this.contacts = this.contacts.filter(currentEmployee => contact.id !== currentEmployee.id)

      const item = {
        namespace: 'table',
        action: 'delete',
        params: { tableName: 'contacts', data: [contact] },
      }

      const req = await mainStore.mutation({ items: [item] })
    },
  },
})
