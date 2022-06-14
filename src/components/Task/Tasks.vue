<script setup lang="ts">
import type { Task } from '~/types'
const { workorderId } = defineProps<Props>()
const { data } = storeToRefs(useMainStore())
const { getByKeyValue, getByType, deleteById, addItem } = useMainStore()

interface Props {
  workorderId: string
}

const tasks = $computed((): Task[] =>
  getByKeyValue({ key: 'FK|workorder_id', value: workorderId, type: 'lineItems' })
    ?.sort((a, b) => a.item_number - b.item_number))

const deleteTask = (task: Task) => {
  deleteById({ id: task.id, type: 'lineItems' })
}

const addLineItem = () => {
  const lineItem = {
    id: useUid(),
    workorder_id: workorderId,
    description: '',
    details: '',
    quantity: '',
    hours: 0,
    notes: '',
    item_number: tasks.length + 1,
    completed: false,
  }

  addItem({ item: lineItem, type: 'lineItems' })
  currentTask = lineItem
  showModal = true
}

let showModal = $ref(false)
let currentTask = $ref()

const editTask = (task: Task) => {
  showModal = true

  currentTask = task
}

const moveTask = (task: Task, delta: 1 | -1) => {
  const idx = task.item_number - 1

  const targetIdx = idx + delta
  const otherTask = tasks[targetIdx]

  task.item_number = task.item_number + delta
  otherTask.item_number = idx + delta

  tasks[targetIdx] = task
  tasks[idx] = otherTask
}
</script>

<template>
  <div flex="~ col" gap4>
    <div flex justify-between>
      <h3 text-h3>
        Line Items
      </h3>
    <Button class="w-32" @click="addLineItem">
      <Icon class="i-fa-solid:plus text-2xl" />
    </Button>
    </div>


    <!-- EXISTING LINE ITEMS -->
    <section v-if="tasks?.length" flex="~ col" gap2 >
      <Card v-for="task, idx in tasks" :key="task.id" relative>
        <TaskItem :data="task" :idx="idx" />
        <div absolute flex="~ col" left="-6" top-0 bottom-0 justify-center>
          <button v-if="idx" i-carbon:caret-up icon-btn @click="moveTask(task, -1)" />
          <button i-ion:edit icon-btn @click="editTask(task)" />
          <button i-carbon:close icon-btn @click="deleteTask(task)" />
          <button v-if="idx !== tasks.length - 1" i-carbon:caret-down icon-btn @click="moveTask(task, 1)" />
        </div>
      </Card>
    </section>

    <template v-if="showModal">
      <EditTask :data="currentTask" @close="showModal = false" />
    </template>
  </div>
</template>

<style scoped>
.grid {
  grid-template-columns: 80px 100px 100px auto 75px 85px;
}
</style>
