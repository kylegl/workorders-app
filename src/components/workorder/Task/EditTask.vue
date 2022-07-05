<script setup lang="ts">
const { task } = storeToRefs(useTaskStore())
const { saveTask } = useTaskStore()
const richTextFields = ['description', 'details', 'quantity', 'notes']

const modal = ref<HTMLDivElement>()
onClickOutside(modal, () => saveTask())
</script>

<template>
  <div
    flex="~ col"
    fixed right-0 left-0 top-0 bottom-0 m-auto
    items-center justify-center
    z-11
  >
    <Card
      ref="modal"
      flex="~ col" gap4 m16 p4
      min-w-100
      border-base bg-1
      w="1/2"
    >
      <div flex justify-between>
        <div text-h4>
          {{ `Edit Line Item #${task?.item_number}` }}
        </div>
        <button i-carbon:close text-3xl font-extrabold icon-btn @click="saveTask" />
      </div>
      <div v-for="key in richTextFields" :key="key">
        <div capitalize text-h5>
          {{ key }}
        </div>
        <div>
          <Editor v-model:content="task[key]" :data="task?.[key]" />
        </div>
      </div>
      <div mr-auto>
        <div text-h5>
          Hours
        </div>
        <Input v-model="task.hours" type="number" />
      </div>
      <Button m-auto @click="saveTask" hover="text-flip bg-green">
        <Icon i-fa-solid:plus text-2xl />
        Add
      </Button>
    </Card>
  </div>
</template>

