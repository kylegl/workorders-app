<script setup lang="ts">
const props = defineProps<{ status: string; options: Array<string>; disabled: boolean }>()
const emit = defineEmits<{
  (e: 'update:status', value: string | undefined): void
}>()

const currentStatus = useVModel(props, 'status', emit)
</script>

<template>
  <div>
    <label text-h5>Status</label>
    <SelectV2
      v-model:value="currentStatus"
      :data="options"
      :disabled="disabled" :clearable="false" :searchable="false"
      bg-1 text-norm border="~ base" rounded min-w-36
    />
  </div>
</template>
