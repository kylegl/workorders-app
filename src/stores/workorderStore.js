import { defineStore } from 'pinia'
import { useMainStore } from './mainStore'
import { parseTimestampToDate } from '~/composables'
import { useClientStore } from '~/stores/clientStore'
import { useContactStore } from '~/stores/contactStore'
import { useJobStore } from '~/stores/jobStore'
import { useEmployeeStore } from '~/stores/employeeStore'
import { useBidStore } from '~/stores/bidStore'
import { useLineItemStore } from '~/stores/lineItemStore'

export const useWorkorderStore = defineStore('workorderList', {
  state: () => ({
    workorders: [],
    loading: false,
    error: undefined,
    schema: {
      start_date: {
        title: 'Start Date',
        type: 'date',
      },
      due_date: {
        title: 'Due Date',
        type: 'date',
      },
      id: {
        title: 'ID',
        type: '',
      },
      status: {
        title: 'Status',
        type: '',
      },
      client_id: {
        title: 'Client',
        key: 'client',
        type: 'id',
        store: useClientStore,
        entryKey: 'name',
      },
      description: {
        title: 'Description',
        type: '',
      },
      employee_id: {
        title: 'Employee',
        key: 'employee',
        type: 'id',
        store: useEmployeeStore,
        entryKey: 'name',
      },
      contact_id: {
        title: 'Contact',
        key: 'contact',
        type: 'id',
        store: useContactStore,
        entryKey: 'name',
      },
      job_id: {
        title: 'Job',
        key: 'job',
        type: 'id',
        store: useJobStore,
        entryKey: 'job_number',
      },
      bid_id: {
        title: 'Bid',
        key: 'bid',
        type: 'id',
        store: useBidStore,
        entryKey: 'bid_id',
      },
      parking_info: {
        title: 'Parking Info',
        type: '',
      },
      notes: {
        title: 'Notes',
        type: '',
      },
      bill_type: {
        title: 'Billing',
        type: '',
      },
      job_type: {
        title: 'Job Type',
        type: '',
      },
      created_at: {
        title: 'Created',
        type: 'date',
      },
      updated_at: {
        title: 'Last Updated',
        type: 'date',
      },
      closed_at: {
        title: 'Closed',
        type: 'date',
      },
    },
  }),
  getters: {
    mainStore: () => useMainStore(),
    getById: state => id => state.workorders.find(entry => entry.id === id),
    parseWorkorder(state) {
      return (id) => {
        const workorder = this.getById(id)
        if (!workorder) return

        const res = Object.entries(workorder).reduce((result, item) => {
          let [key, value] = item
          let updatedValue

          if (!this.schema[key].type) updatedValue = value
          if (this.schema[key].type === 'date') updatedValue = parseTimestampToDate(value)
          if (this.schema[key].type === 'id') {
            updatedValue = this.schema[key].store().getById(value)?.[this.schema[key].entryKey]
            key = this.schema[key].key
          }

          result[key] = updatedValue
          return result
        }, {})

        return res
      }
    },
    displayValues(state) {
      return this.workorders
        ? this.workorders.map(entry => this.parseWorkorder(entry.id))
        : undefined
    },
    displayKeys: state => keys => keys.map((key) => { return { key, title: state.schema[key].title } }),
  },
  actions: {
    getWorkorder(id) {
      const workorder = this.getById(id)
      if (!workorder) return

      const res = Object.entries(workorder).reduce((result, item) => {
        let [key, value] = item
        let updatedValue

        if (!this.schema[key].type) updatedValue = value
        if (this.schema[key].type === 'date') updatedValue = parseTimestampToDate(value)
        if (this.schema[key].type === 'id') {
          updatedValue = this.schema[key].store().getById(value)?.[this.schema[key].entryKey]
          key = this.schema[key].key
        }

        result[key] = updatedValue
        return result
      }, {})
      return res
    },
    // getDisplayValues: () => {
    //   return this.state.workorders
    // },
  },
})
