<script setup lang="ts">
const props = defineProps<{ id: string; disabled: boolean; saved: boolean }>()
const emit = defineEmits<{
  (e: 'update:id', value: string | undefined): void
  (e: 'update:isDirty', value: boolean): void
}>()
const { data, loading, error } = storeToRefs(useMainStore())
const isDirty = $ref(false)

const jobId = useVModel(props, 'id', emit)

watchEffect(() => emit('update:isDirty', isDirty))
</script>

<template>
  <div>
    <Datalist
      v-model="jobId"
      type="jobs"
      :list="data.jobs"
      :search-keys="['job_name', 'address']"
      :show-keys="['job_name', 'address']"
      class="z-2"
      label="Job"
      :disabled="disabled"
    />
  </div>
</template>
