import { acceptHMRUpdate, defineStore } from 'pinia'
import { newTask } from '../tasks/constants'
import { useWoStore } from '../wo/useWoStore'
import type { Lineitem } from '~/types'

export const useTaskStore = defineStore('taskStore', () => {
  const main = useMainStore()
  const { wo, state } = storeToRefs(useWoStore())

  const taskState = reactive({
    showModal: false,
    dirty: false,
  })

  const id = ref('')
  const task = computed((): Lineitem => main.getById({ id: id.value, type: 'line_items' }))
  const watcher = ref('')

  function createTask(taskNumber: number) {
    const task = { ...newTask }
    task.id = useUid()
    task['FK|workorder_id'] = wo.value.id
    task.item_number = taskNumber

    main.addItem({ data: task, table: 'line_items' })
    setId(task.id)
    taskState.showModal = true
  }

  function saveTask() {
    taskState.showModal = false
    mutation('line_items', 'update', task.value, main.versions)
    taskState.dirty = false
  }

  function loadTask(taskId: string) {
    stop()
    setId(taskId)
  }

  function editTask(id: string) {
    taskState.showModal = true
    loadTask(id)
  }

  function deleteTask(id: string) {
    main.deleteById({ id, table: 'line_items' })
  }

  function setId(taskId) {
    id.value = taskId
    getWatcher()
  }

  function getWatcher() {
    const stop = watch(task.value, () => {
      state.dirty = true
    })

    watcher.value = stop
  }

  return { task, id, taskState, createTask, loadTask, editTask, deleteTask, saveTask }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useWoStore, import.meta.hot))
