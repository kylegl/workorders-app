import { acceptHMRUpdate, defineStore } from 'pinia'
import { newTask } from '../tasks/constants'
import { useWoStore } from '../wo/useWoStore'
import type { Lineitem } from '~/types'

export const useTaskStore = defineStore('taskStore', () => {
  const main = useMainStore()
  const { wo, state } = useWoStore()

  const taskState = reactive({
    showModal: false,
  })

  const id = ref('')
  const task = computed((): Lineitem => main.getById({ id: id.value, type: 'line_items' }))

  function createTask(taskNumber: number) {
    const task = { ...newTask }
    task.id = useUid()
    task['FK|workorder_id'] = wo.id
    task.item_number = taskNumber

    main.addItem({ data: task, table: 'line_items' })
    id.value = task.id
    taskState.showModal = true
  }

  function saveTask() {
    taskState.showModal = false
    mutation('line_items', 'update', task.value, main.versions)
  }

  function loadTask(taskId: string) {
    id.value = taskId
  }

  function editTask(id: string) {
    taskState.showModal = true
    loadTask(id)
  }

  function deleteTask(id: string) {
    main.deleteById({ id, table: 'line_items' })
  }

  return { task, id, taskState, createTask, loadTask, editTask, deleteTask, saveTask }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useWoStore, import.meta.hot))
