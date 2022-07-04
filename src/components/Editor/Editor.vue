<script setup lang="ts">
import { Delta, QuillEditor } from '@vueup/vue-quill'
import './vue-quill.snow.css'

const { data, type = 'delta' } = defineProps<{
  data: Delta
  type?: string | undefined
}>()

const emit = defineEmits(['update:content'])

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
]

const initialContent = type === 'delta' ? new Delta(data) : data ?? ''

const editorContent = $ref(initialContent)
const updateValue = () => emit('update:content', editorContent)
</script>

<template>
  <div>
    <QuillEditor
      v-model:content="editorContent"
      :content-type="type"
      theme="snow"
      :toolbar="toolbarOptions"
      rounded-b border="~ base 3"
      input-base
      @text-change="updateValue"
    />
  </div>
</template>

