<script setup lang="ts">
const props = defineProps<{
  workorder: Workorder
  disabled: boolean
  saved: boolean
}>()
const emit = defineEmits<{
  (e: 'update:isDirty', value: string | undefined): void
}>()
const wo = useVModel(props, 'workorder', emit)
</script>

<template>
  <Card w="1/2" flex="~ col" gap4>
    <h3 text-h4>
      Project Info
    </h3>

    <ClientPicker
      v-model:id="wo['FK|client_id']" :disabled="disabled" :saved="saved"
      z3
    />

    <JobPicker
      v-model:id="wo['FK|job_id']" :disabled="disabled" :saved="saved"
      z2
    />

    <ContactPicker
      v-model:id="wo['FK|contact_id']" :disabled="disabled" :saved="saved"
      z1
    />
  </Card>
</template>
