<script setup lang="ts">
import { Delta, QuillEditor } from '@vueup/vue-quill'
import './vue-quill.snow.css'

const { data } = defineProps<{
  data: Delta
}>()

const emit = defineEmits(['update:content'])

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
]

const initialContent = new Delta(data)

const delta = $ref<Delta>(
  initialContent,
)
const updateValue = () => emit('update:content', delta)
</script>

<template>
  <div>
    <QuillEditor
      v-model:content="delta"
      content-type="delta"
      theme="snow"
      :toolbar="toolbarOptions"
      rounded-b
      bg-bg-b
      @text-change="updateValue"
    />
  </div>
</template>

<style scoped>
input {
  background-color: #505050;
}
</style>

