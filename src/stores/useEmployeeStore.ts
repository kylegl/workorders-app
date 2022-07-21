import { acceptHMRUpdate, defineStore } from 'pinia'
import type { EmployeeType } from '~/types'
import { employeeValidator } from '~/types'

export const useEmployeeStore = defineStore('employeeStore', () => {
  const main = useMainStore()

  const state = reactive({
    showModal: false,
    dirty: false,
    new: false,
  })

  const id = ref('')
  const employee = computed((): EmployeeType => main.getById({ id: id.value, type: 'employees' }))
  const watcher = ref('')

  function addEmployee() {
    const employee = { ...newEmployee }
    employee.id = useUid()
    main.addItem({ data: employee, table: 'employees' })
    setId(employee.id)
    state.new = true
    openModal()
  }

  function saveEmployee() {
    if (state.dirty) {
      const res = employeeValidator.safeParse(employee.value)
      console.log(res)
      mutation('employees', 'update', employee.value, main.versions)
      state.dirty = false
    }

    if (!state.dirty && state.new)
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

  function deleteEmployee() {
    closeModal()
    main.deleteById({ data: employee.value, table: 'employees' })
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
    state.showModal = true
  }

  function closeModal() {
    state.showModal = false
    state.dirty = false
    state.new = false
  }

  return { employee, state, addEmployee, saveEmployee, loadEmployee, editEmployee, deleteEmployee, setId }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useEmployeeStore, import.meta.hot))
