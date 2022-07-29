<script setup lang="ts">
const { wo, state } = storeToRefs(useWoStore())
</script>

<template>
  <Card flex="~ col" gap4 max-h-max>
    <h3 text-h4>
      Work Order Info
    </h3>

    <div flex="~ col" gap4>
      <ClientPicker
        v-model:id="wo['FK|client_id']" :disabled="state.saved"
        z3
      />
      <JobPicker
        v-model:id="wo['FK|job_id']" :disabled="state.saved"
        z2
      />
      <PropertyPicker v-model:id="wo['FK|property_id']" :disabled="state.saved" />
      <ContactPicker
        v-model:value="wo['FK|contact_id']" :disabled="state.saved" :client-id="wo['FK|client_id']"
        z1
      />
      <div flex gap3>
        <JobTypePicker
          v-model:type="wo.job_type"
          :options="jobTypeOptions"
          :disabled="state.saved"
          w="1/2"
        />

        <BillTypePicker
          v-model:type="wo.bill_type"
          :options="billingOptions"
          :disabled="state.saved"
           w="1/2"
        />
      </div>
    </div>
  </Card>
</template>
