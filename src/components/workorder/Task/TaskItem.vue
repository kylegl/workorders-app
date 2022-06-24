<script setup lang="ts">
import type { Lineitem, Move } from '~/types'
import { useTaskStore } from '~/stores/tasks/useTaskStore'
import { useWoStore } from '~/stores/wo/useWoStore'
const props = defineProps<{
  id: string
  idx: number
  listLength: number
  data: Lineitem
}>()
const emit = defineEmits<{
  (e: 'move', value: Move): void
}>()
const { deleteById } = useMainStore()
const { state } = storeToRefs(useWoStore())
const { taskState } = storeToRefs(useTaskStore())
const { editTask, closeModal } = useTaskStore()
const task = $computed(() => props.data)

const moveTask = (task: Lineitem, delta: number) => emit('move', { task, delta })
const deleteTask = () => deleteById({ data: task, table: 'line_items' })

const toggleComplete = () => {
  task.completed = !task.completed
}

watchEffect(() => {
  task.item_number = props.idx + 1
})
const pos = $computed(() => {
  const listLength = props.listLength
  if (listLength === 1) return 'single'

  return props.idx === listLength - 1
    ? 'last'
    : props.idx === 0 ? 'first' : 'middle'
})

const upArrow = $computed(() => {
  return !state.value.disabled ? !!(pos === 'middle' || pos === 'last') : false
})
const downArrow = $computed(() => {
  return !state.value.disabled ? !!(pos === 'middle' || pos === 'first') : false
})
</script>

<template>
  <Card
    v-if="task"
    relative
  >
    <div
      flex justify-between gap-x-2 h-auto min-h-20 w-full
    >
      <div flex="~ col">
        <div text-h5>
          {{ `#${task.item_number}` }}
        </div>
        <button
          m-auto text-xl in_out
          @click="toggleComplete"
        >
          <Icon v-if="!task.completed" i-carbon:checkbox text-2xl />
          <Icon v-if="task.completed" i-ci:check-bold text-green text-2xl />
        </button>
      </div>

      <div flex="~ col" w-96>
        <div text-h5>
          Description
        </div>
        <div v-html="parseDelta(task.description)" />
      </div>

      <div flex="~ col" w-24 max-w-48>
        <div text-h5>
          Details
        </div>
        <div v-html="parseDelta(task.details)" />
      </div>

      <div flex="~ col" min-w-content max-w-28>
        <div text-h5>
          QTY
        </div>
        <div v-html="parseDelta(task.quantity)" />
      </div>

      <div flex="~ col" grow>
        <div text-h5>
          Notes
        </div>
        <div v-html="parseDelta(task.notes)" />
      </div>

      <div flex="~ col" w-12 ml-auto>
        <div text-h5>
          Hours
        </div>
        <div>
          {{ task.hours }}
        </div>
      </div>
    </div>
    <div absolute flex="~ col" gap1 left="-6" top-0 bottom-0 justify-center>
      <button v-if="upArrow" i-carbon:caret-up icon-btn @click="moveTask(task, -1)" />
      <button i-ion:edit icon-btn @click="editTask" />
      <button i-carbon:trash-can icon-btn @click="deleteTask" />
      <button v-if="downArrow" i-carbon:caret-down icon-btn @click="moveTask(task, 1)" />
    </div>
  </Card>
</template>
