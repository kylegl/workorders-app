import { acceptHMRUpdate, defineStore } from 'pinia'
import { employeeValidator } from '~/types'

export const useEmployeeStore = defineStore('employeeStore', () => {
  const main = useMainStore()

  const state = reactive({
    showModal: false,
    dirty: false,
  })

  const id = ref('')
  const employee = computed((): EmployeeType => main.getById({ id: id.value, type: 'employees' }))
  const watcher = ref('')

  function addEmployee() {
    const employee = { ...newEmployee }
    employee.id = useUid()
    main.addItem({ data: employee, table: 'employees' })
    setId(employee.id)
    state.showModal = true
  }

  function saveEmployee() {
    const res = employeeValidator.safeParse(employee.value)
    state.showModal = false
    mutation('employees', 'update', employee.value, main.versions)
    state.dirty = false
  }

  function loadEmployee(employeeId: string) {
    stop()
    setId(employeeId)
  }

  function editEmployee(id: string) {
    state.showModal = true
    loadEmployee(id)
  }

  function deleteEmployee(id: string) {
    main.deleteById({ id, table: 'employees' })
  }

  function setId(employeeId: string) {
    id.value = employeeId
    getWatcher()
  }

  // TODO abstract this to utils
  function getWatcher() {
    const stop = watch(employee.value, () => {
      state.dirty = true
    })

    watcher.value = stop
  }

  return { employee, state, addEmployee, saveEmployee, loadEmployee, editEmployee, deleteEmployee, setId }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useEmployeeStore, import.meta.hot))
