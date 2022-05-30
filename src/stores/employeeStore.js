import { defineStore } from 'pinia'
import { useUid } from '../composables/uuid'
import { useMainStore } from './mainStore'

export const useEmployeeStore = defineStore('employeeList', {
  state: () => ({
    employees: [],
    loading: true,
    error: undefined,
  }),
  getters: {
    mainStore: () => useMainStore(),
  },
  actions: {
    async fetchEmployees() {
      try {
        this.loading = true
        this.mainStore.query()
        this.employees = this.mainStore.data.employees ?? []
        this.loading = false
      }
      catch (err) {
        this.error = 'I\'m had trouble finding the employees'
        this.loading = false
      }
    },
    async addEmployee({ employee }) {
      employee.id = useUid()
      this.employees.push(employee)

      const item = {
        namespace: 'table',
        action: 'add',
        params: { tableName: 'employees', data: [employee] },
      }
      const req = await this.mainStore.mutation({ items: [item] })
    },
    async deleteEmployee({ employee }) {
      this.employees = this.employees.filter(currentEmployee => employee.id !== currentEmployee.id)

      const item = {
        namespace: 'table',
        action: 'delete',
        params: { tableName: 'employees', data: [employee] },
      }

      const req = await this.mainStore.mutation({ items: [item] })
    },
  },
})
