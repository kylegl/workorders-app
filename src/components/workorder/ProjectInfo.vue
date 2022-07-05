<script setup lang="ts">
const { wo, state } = storeToRefs(useWoStore())
</script>

<template>
  <Card w="1/2" flex="~ col" gap4>
    <h3 text-h4>
      Project Info
    </h3>

    <ClientPicker
      v-model:id="wo['FK|client_id']" :disabled="state.disabled"
      z3
    />

    <JobPicker
      v-model:id="wo['FK|job_id']" :disabled="state.disabled"
      z2
    />

    <ContactPicker
      v-model:id="wo['FK|contact_id']" :disabled="state.disabled"
      z1
    />
  </Card>
</template>
