import { acceptHMRUpdate, defineStore } from 'pinia'
import { newTask } from '../tasks/constants'
import { useWoStore } from '../wo/useWoStore'
import type { Lineitem } from '~/types'

export const useTaskStore = defineStore('taskStore', () => {
  const main = useMainStore()
  const { wo, state } = useWoStore()

  const taskState = reactive({
    taskDisabled: false,
    taskDirty: false,
    taskSaved: false,
    showModal: false,
  })

  const task = reactive({} as Lineitem)

  function createTask(taskNumber: number) {
    taskState.showModal = true

    setNewVals(newTask, task)
    task.id = useUid()
    task['FK|workorder_id'] = wo.id
    task.item_number = taskNumber
  }

  function editTask() {
    // TODO capture initial state to reset if need be.
    taskState.showModal = true
    taskState.taskSaved = false
  }

  function saveTask() {
    try {
      const isExisting = main.data.line_items?.find(entry => entry.id === task.id)
      const unrefTask = deRef(task)
      if (isExisting)
        Object.keys(unrefTask).forEach(key => isExisting[key] = unrefTask[key])

      if (!isExisting)
        main.addItem({ data: unrefTask, table: 'line_items' })

      console.log('save task')
      taskState.taskDirty = false
      taskState.taskSaved = true
      taskState.showModal = false
    }
    catch (err) {
      getErrorMessage(err)
    }
  }

  function closeModal() {
    taskState.showModal = false
  }

  function loadTask(id: string) {
    const match = main.getById({ id, type: 'line_items' })
    if (match) {
      const unrefMatch = deRef(match)
      setNewVals(task, unrefMatch)
    }
  }

  function setNewVals(from, to) {
    Object.keys(from).forEach(key => to[key] = from[key])
  }

  return { task, taskState, createTask, editTask, loadTask, saveTask, closeModal }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useWoStore, import.meta.hot))
