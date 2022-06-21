<script setup lang="ts">
const props = defineProps<{ type: string; options: Array<string>; disabled: boolean; saved: boolean }>()
const emit = defineEmits<{
  (e: 'update:type', value: string | undefined): void
  (e: 'update:isDirty', value: boolean): void
}>()
const isDirty = $ref(false)

const jobType = useVModel(props, 'type', emit)
</script>

<template>
  <div>
    <Select
      v-model="jobType"
      label="Job Type"
      :list="options"
      :disabled="disabled"
    />
  </div>
</template>
