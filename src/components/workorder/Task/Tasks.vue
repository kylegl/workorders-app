<script setup lang="ts">
import type { Task } from '~/types'
const { workorderId, disabled, saved } = defineProps<{ workorderId: string; disabled: boolean; saved: boolean }>()
const emit = defineEmits(['dirty'])
const { data } = storeToRefs(useMainStore())
const { getByKeyValue, addItem } = useMainStore()

const tasks = $computed((): Task[] =>
  getByKeyValue({ key: 'FK|workorder_id', value: workorderId, type: 'line_items' })
    ?.sort((a: Task, b: Task) => a.item_number - b.item_number))

const addTask = () => {
  const lineItem = createLineItem(workorderId, tasks)

  addItem({
    table: 'line_items',
    data: lineItem,
  })
}

const moveTask = (task: Task, delta: 1 | -1) => {
  const idx = task.item_number - 1

  const targetIdx = idx + delta
  const otherTask = tasks[targetIdx]

  task.item_number = task.item_number + delta
  otherTask.item_number = idx

  tasks[targetIdx] = task
  tasks[idx] = otherTask
}
let isDirty = $ref(0)
const handleDirt = (dirt) => {
  if (dirt) isDirty++
  else isDirty--
}

watchEffect(() => emit('dirty', isDirty))
</script>

<template>
  <div flex="~ col" gap4>
    <div flex justify-between>
      <h3 text-h3>
        Line Items
      </h3>
      <Button @click="addTask">
        <Icon i-fa-solid:plus text-2xl />
        Line Item
      </Button>
    </div>

    <section v-if="tasks?.length" flex="~ col" gap2>
      <TaskItem
        v-for="task, idx in tasks" :key="task.id"
        :task="task" :idx="idx" :list-length="tasks.length"
        :disabled="disabled"
        :saved="saved"
        @move="moveTask($event.task, $event.delta)"
        @dirty="handleDirt"
      />
    </section>
  </div>
</template>
