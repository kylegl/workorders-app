<script setup lang="ts">
import type { Lineitem } from '~/types'

const { task, idx, listLength, disabled, saved } = defineProps<{
  task: Lineitem
  idx: number
  listLength: number
  disabled: boolean
  saved: boolean
}>()
const emit = defineEmits(['move', 'dirty'])
const { data } = storeToRefs(useMainStore())
const { update, deleteById } = useMainStore()
let showModal = $ref(false)
let isSaved = $ref(false)
let isDirty = $ref(false)

const moveTask = (task: Lineitem, delta: number) => emit('move', { task, delta })
const deleteTask = (task: Lineitem) => deleteById({ data: task, table: 'line_items' })
const editTask = () => showModal = true

const handleClose = (saved: boolean) => {
  showModal = false
  isSaved = saved
}

const toggleComplete = () => {
  isSaved = true
  task.completed = !task.completed
}

watchEffect(() => task.item_number = idx + 1)
watchEffect(() => emit('dirty', isDirty))

collectDirt($$(task), $$(isDirty))

watchEffect(() => {
  const isUpdate = (isDirty && (isSaved || saved))
  if (isUpdate) {
    update({ table: 'line_items', data: task })
    isDirty = false
    isSaved = false
  }
})

const pos = $computed(() => idx === listLength - 1 ? 'last' : idx === 0 ? 'first' : 'middle')
</script>

<template>
  <Card
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
    <div absolute flex="~ col" left="-6" top-0 bottom-0 justify-center>
      <button v-if="pos !== 'first' && !disabled" i-carbon:caret-up icon-btn @click="moveTask(task, -1)" />
      <button i-ion:edit icon-btn @click="editTask()" />
      <button i-carbon:close icon-btn @click="deleteTask(task)" />
      <button v-if="pos !== 'last' && !disabled" i-carbon:caret-down icon-btn @click="moveTask(task, 1)" />
    </div>
    <template v-if="showModal">
      <EditTask :task="task" @close="handleClose" />
    </template>
  </Card>
</template>
