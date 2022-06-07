import { defineStore } from 'pinia'
import { useUid } from '~/composables'
import { useMainStore } from '~/stores/mainStore'

export const useEmployeeStore = defineStore('employees', {
  state: () => ({
    employees: [],
    loading: false,
    error: undefined,
  }),
  getters: {
    getById: state => id => state.employees.find(entry => entry.id === id),
  },
  actions: {
    async addEmployee({ employee }) {
      const mainStore = useMainStore()
      employee.id = useUid()
      this.employees.push(employee)

      const item = {
        namespace: 'table',
        action: 'add',
        params: { tableName: 'employees', data: [employee] },
      }
      const req = await mainStore.mutation({ items: [item] })
    },
    async deleteEmployee({ employee }) {
      const mainStore = useMainStore()
      this.employees = this.employees.filter(currentEmployee => employee.id !== currentEmployee.id)

      const item = {
        namespace: 'table',
        action: 'delete',
        params: { tableName: 'employees', data: [employee] },
      }

      const req = await mainStore.mutation({ items: [item] })
    },
  },
})
