<script setup lang="ts">
import type { Lineitem, Move } from '~/types'

const { data } = storeToRefs(useMainStore())
const { getByKeyValue } = useMainStore()
const { wo, state } = storeToRefs(useWoStore())
const { task, taskState } = storeToRefs(useTaskStore())
const { createTask } = useTaskStore()

const tasks = $computed(() => getByKeyValue({ key: 'FK|workorder_id', value: wo.value.id, type: 'line_items' })
  .sort((a: Lineitem, b: Lineitem) => a.item_number! - b.item_number!))

const moveTask = (move: Move) => {
  const idx = move.task.item_number! - 1

  const targetIdx = idx + move.delta
  const otherTask = tasks[targetIdx]

  move.task.item_number = move.task.item_number! + move.delta
  otherTask.item_number = idx

  tasks[targetIdx] = move.task
  tasks[idx] = otherTask
}
</script>

<template>
  <div flex="~ col" gap4>
    <div flex justify-between>
      <h3 text-h3>
        Line Items
      </h3>
      <Button btn-primary @click="createTask(tasks?.length + 1)">
        <Icon i-fa-solid:plus text-2xl />
        Line Item
      </Button>
    </div>

    <section v-if="tasks?.length" flex="~ col" gap2>
      <TaskItem
        v-for="tsk, idx in tasks" :id="tsk.id"
        :key="tsk.id" :idx="idx" :list-length="tasks.length"
        :data="tsk"
        @move="moveTask"
      />
    </section>

    <template v-if="taskState.showModal">
      <EditTask v-if="task" :task="task" />
    </template>
  </div>
</template>
