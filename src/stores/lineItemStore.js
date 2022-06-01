import { defineStore } from 'pinia'

export const useLineItemStore = defineStore('lineItemList', {
  state: () => ({
    lineItems: [],
    loading: false,
    error: undefined,
  }),
  getters: {
    getById: state => id => state.lineItems.find(entry => entry.id === id),
    getLineItemsByWorkorderId: state => id => state.lineItems.filter(lineItem => lineItem.workorder_id === id),
  },
  actions: {
  },
})
