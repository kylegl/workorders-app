<script setup lang="ts">
import { useWoStore } from '~/stores/wo/useWoStore'
import { woStatuses } from '~/stores/wo/constants'

const { wo, state } = useWoStore()
</script>

<template>
  <div flex="~ col" gap4>
    <template v-if="wo">
      <div flex justify-between z10>
        <StatusPicker v-model:status="wo.status" :options="woStatuses" :disabled="state.disabled" />

        <EmployeePicker v-model:id="wo['FK|employee_id']" :disabled="state.disabled" />
      </div>

      <section class="flex gap-x-4">
        <ProjectInfo v-model:workorder="wo" :disabled="state.disabled" />

        <Card w="1/2" flex="~ col" gap4>
          <h3 class="text-h4">
            Work Order Info
          </h3>

          <DatePicker v-model:date="wo.start_date" :disabled="state.disabled" label="Start Date" />

          <DatePicker v-model:date="wo.due_date" :disabled="state.disabled" label="Due Date"/>

          <div class="flex gap-x-4">
            <JobTypePicker v-model:type="wo.job_type" :options="jobTypeOptions" :disabled="state.disabled" />

            <BillTypePicker v-model:type="wo.bill_type" :options="billingOptions" :disabled="state.disabled" />
          </div>
        </Card>
      </section>

      <section>
        <Card w-full flex="~ col" gap4>
          <div text-h5>
            Description
          </div>
          <div v-if="state.disabled" v-html="parseDelta(wo.description)" />
          <Editor
            v-else
            v-model:content="wo.description"
            :data="wo.description"
            label="Description"
            :disabled="state.disabled"
            place-holder-text="Description"
          />

          <div text-h5>
            Notes
          </div>
          <div v-if="state.disabled" v-html="parseDelta(wo.notes)" />
          <Editor
            v-else
            v-model:content="wo.notes"
            :data="wo.notes"
            label="Description"
            :disabled="state.disabled"
            place-holder-text="Description"
          />

          <div text-h5>
            Parking Info
          </div>
          <div v-if="state.disabled" v-html="parseDelta(wo.parking_info)" />
          <Editor
            v-else
            v-model:content="wo.parking_info"
            :data="wo.parking_info"
            label="Description"
            :disabled="state.disabled"
            place-holder-text="Description"
          />
        </Card>
      </section>
    </template>
  </div>
</template>
