<script setup lang="ts">
const props = defineProps<{ id?: string; disabled: boolean }>()
const emit = defineEmits<{
  (e: 'update:id', value: string | undefined): void
}>()

const { data } = storeToRefs(useMainStore())

const employeeId = useVModel(props, 'id', emit)
</script>

<template>
  <div>
    <Datalist
      v-model="employeeId"
      label="Assigned To"
      type="employees"
      :list="data.employees"
      :search-keys="['name']"
      :show-keys="['name', 'position']"
      :disabled="disabled"
    />
  </div>
</template>
