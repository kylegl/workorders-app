<script setup lang="ts">
import type { Task } from '~/types'

const { data } = defineProps<{
  data: Task
}>()
const emit = defineEmits(['close'])
const richTextFields = $computed(() => Object.keys(data).filter(key => ['description', 'details', 'quantity', 'notes'].includes(key)))
const closeModal = () => emit('close')

const modal = ref<HTMLDivElement>()
onClickOutside(modal, () => closeModal())
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
      w="1/2"
    >
      <div flex justify-between>
        <div text-h4>
          {{ `Edit Line Item #${data.item_number}` }}
        </div>
        <button i-carbon:close text-2xl icon-btn @click="closeModal" />
      </div>
      <div v-for="key in richTextFields" :key="key">
        <div capitalize text-h5>
          {{ key }}
        </div>
        <div>
          <Editor v-model:content="data[key]" :data="data[key]" type="text" />
        </div>
      </div>
      <div mr-auto>
        <div text-h5>
          Hours
        </div>
        <Input v-model="data.hours" type="number" />
      </div>
      <Button @click="closeModal" m-auto >
        <Icon i-carbon:save text-3xl  icon-btn/>
          Save
      </Button>
    </Card>
  </div>
</template>

