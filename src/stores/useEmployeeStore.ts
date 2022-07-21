import { acceptHMRUpdate, defineStore } from 'pinia'
import type { EmployeeType } from '~/types'
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
    openModal()
  }

  function saveEmployee() {
    if (state.dirty) {
      const res = employeeValidator.safeParse(employee.value)
      mutation('employees', 'update', employee.value, main.versions)
      state.dirty = false
    }

    if (!state.dirty)
      main.deleteById({ data: employee.value, table: 'employees', localOnly: true })

    closeModal()
  }

  function loadEmployee(employeeId: string) {
    stop()
    setId(employeeId)
  }

  function editEmployee(id: string) {
    loadEmployee(id)
    openModal()
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

  function openModal() {
    if (!state.showModal)
      state.showModal = true
  }

  function closeModal() {
    if (state.showModal)
      state.showModal = false
  }

  return { employee, state, addEmployee, saveEmployee, loadEmployee, editEmployee, deleteEmployee, setId }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useEmployeeStore, import.meta.hot))
