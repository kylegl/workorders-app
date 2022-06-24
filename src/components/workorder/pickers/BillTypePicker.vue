<script setup lang="ts">
const props = defineProps<{ type: string; options: Array<string>; disabled: boolean }>()
const emit = defineEmits<{
  (e: 'update:type', value: string | undefined): void
}>()

const billType = useVModel(props, 'type', emit)
</script>

<template>
  <div>
    <Select
      v-model="billType"
      label="Bill Type"
      :list="options"
      :disabled="disabled"
    />
  </div>
</template>
