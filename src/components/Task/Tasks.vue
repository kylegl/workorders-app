<script setup lang="ts">
const { workorderId } = defineProps<Props>()
const { data } = storeToRefs(useMainStore())
const { getByKeyValue, getByType, deleteById } = useMainStore()

interface Props {
  workorderId: string
}

const tasks = computed(() => getByKeyValue({ key: 'workorder_id', value: workorderId, type: 'lineItems' }))

const deleteTask = (task) => {
  deleteById({ id: task.id, type: 'lineItems' })
}

const editTask = (task) => {
  task.description = 'SUCK MY ...'
}

const headers = [
  { key: 'completed', title: 'Status' },
  { key: 'description', title: 'Description' },
  { key: 'details', title: 'Info' },
  { key: 'quantity', title: 'Qty' },
  { key: 'notes', title: 'Notes' },
  { key: 'hours', title: 'Hrs' },
]
const addLineItem = () => {
  console.log('add line item')
}
</script>

<template>
  <div class="flex flex-col gap-y-4 border rounded p-4 w-full">
    <Button class="w-32 m-auto" @click="addLineItem">
      <Icon class="i-fa-solid:plus text-2xl" />
    </Button>

    <!-- EXISTING LINE ITEMS -->
    <section v-if="tasks?.length" flex="~ col" gap2 p4>
      <div v-for="task, idx in tasks" :key="task.id" relative>
        <TaskItem :data="task" />
        <div absolute flex="~ col" left="-6" top-0 bottom-0 justify-center>
          <button i-carbon:caret-up icon-btn />
          <button i-ion:edit icon-btn @click="editTask(task)" />
          <button i-carbon:close icon-btn @click="deleteTask(task)" />
          <button i-carbon:caret-down icon-btn />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.grid {
  grid-template-columns: 80px 100px 100px auto 75px 85px;
}
</style>
