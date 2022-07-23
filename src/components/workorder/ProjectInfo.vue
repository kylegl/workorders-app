<script setup lang="ts">
const { wo, state } = storeToRefs(useWoStore())
const property = $ref('')
</script>

<template>
  <Card w="1/2" flex="~ col" gap4>
    <h3 text-h4>
      Project Info
    </h3>

    <div flex gap4>
      <div flex="~ col" gap4 w="1/2">
        <JobPicker
          v-model:id="wo['FK|job_id']" :disabled="state.saved"
          z2
        />

        <ClientPicker
          v-model:id="wo['FK|client_id']" :disabled="state.saved"
          z3
        />

        <PropertyPicker v-model:id="wo['FK|property_id']" :disabled="state.saved"/>
      </div>

      <div flex="~ col" gap4 w="1/2">
        <div flex gap4>
          <JobTypePicker v-model:type="wo.job_type" :options="jobTypeOptions" :disabled="state.saved" />

          <BillTypePicker v-model:type="wo.bill_type" :options="billingOptions" :disabled="state.saved" />
        </div>

        <ContactPicker
          v-model:id="wo['FK|contact_id']" :disabled="state.saved"
          z1
        />
      </div>
    </div>
  </Card>
</template>
