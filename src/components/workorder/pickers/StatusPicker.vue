<script setup lang="ts">
const props = defineProps<{ status: string; options: Array<string>; disabled: boolean }>()
const emit = defineEmits<{
  (e: 'update:status', value: string | undefined): void
}>()

const currentStatus = useVModel(props, 'status', emit)
</script>

<template>
  <div>
    <Select
      v-model="currentStatus"
      label="Status"
      :list="options"
      :disabled="disabled"
    />
  </div>
</template>
