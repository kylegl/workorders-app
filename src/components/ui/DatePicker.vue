<script setup lang="ts">
const props = defineProps<{ date?: number | null; disabled: boolean; label?: string }>()
const emit = defineEmits<{
  (e: 'update:date', value: string | undefined): void
}>()
const { getReadableDate } = useMainStore()
const readableDate = $ref()
const data = useVModel(props, 'date', emit)

getReadableDate({ timestamp: $$(data), readable: $$(readableDate) })
</script>

<template>
  <div>
    <Input
      v-model="readableDate"
      :label="props?.label"
      type="date"
      :disabled="disabled"
      place-holder-text="Start date"
    />
  </div>
</template>
