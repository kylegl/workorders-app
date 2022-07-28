<script setup lang="ts">
const props = defineProps<{ type: string; options: Array<string>; disabled: boolean }>()
const emit = defineEmits<{
  (e: 'update:type', value: string | undefined): void
}>()

const currType = useVModel(props, 'type', emit)
</script>

<template>
  <div>
    <label text-h5>Job Type</label>
    <SelectV2
      v-model:value="currType"
      :data="options"
      :disabled="disabled" :clearable="false" :searchable="false"
      bg-1 text-norm border="~ base" rounded 
    />
  </div>
</template>
