<script setup lang="ts">
const props = defineProps<{ id: string; disabled: boolean }>()
const emit = defineEmits<{
  (e: 'update:id', value: string | undefined): void
}>()
const { data } = storeToRefs(useMainStore())

const jobId = useVModel(props, 'id', emit)
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
