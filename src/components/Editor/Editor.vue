<script setup lang="ts">
import './vue-quill.snow.css'

const emit = defineEmits(['update:content'])
const content = ref('')
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
]

const updateValue = () => emit('update:content', content)
</script>

<template>
  <QuillEditor
    v-model:content="content"
    theme="snow"
    :toolbar="toolbarOptions"
    content-type="html"
    rounded-b
    bg-bg-b
    @text-change="updateValue"
  />
</template>

<style scoped>
input {
  background-color: #505050;
}
</style>
