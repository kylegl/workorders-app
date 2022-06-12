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
    <div
      ref="modal"
      bg-bg-a
      border="~ bg-bg-d" rounded
      flex="~ col" gap4 m16 p4
      shadow-md
    >
      <div flex justify-between>
        <div text-h4>
          {{ `Edit task #${data.item_number}` }}
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
        <Input v-model="data.hours" type="number" bg-bg-f />
      </div>
      <button
        flex justify-center items-center gap2
        border="~ bg-d/50" m-auto p2 rounded
        @click="closeModal"
      >
        <Icon i-carbon:save text-3xl  icon-btn/>
        <div text-h5>
          Save
        </div>
      </button>
    </div>
  </div>
</template>

