<script setup lang="ts">
const props = defineProps<{ id: string; disabled: boolean; saved: boolean }>()
const emit = defineEmits<{
  (e: 'update:id', value: string | undefined): void
  (e: 'update:isDirty', value: boolean): void
}>()
const { data, loading, error } = storeToRefs(useMainStore())
const isDirty = $ref(false)

const clientId = useVModel(props, 'id', emit)

watchEffect(() => emit('update:isDirty', isDirty))
</script>

<template>
  <div>
    <Datalist
      v-model="clientId"
      label="Assigned To"
      type="employees"
      :list="data.employees"
      :search-keys="['name']"
      :show-keys="['name', 'position']"
      :disabled="disabled"
    />
  </div>
</template>
