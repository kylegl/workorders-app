<script setup lang="ts">
const { task } = storeToRefs(useTaskStore())
const { saveTask } = useTaskStore()
const richTextFields = ['description', 'details', 'quantity', 'notes']
</script>

<template>
  <div flex="~ col" gap4 w-full>
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
    <Button m-auto hover="text-flip bg-green" @click="saveTask">
      <Icon i-fa-solid:plus text-2xl />
      Add
    </Button>
  </div>
</template>

