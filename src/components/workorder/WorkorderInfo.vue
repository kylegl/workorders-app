<script setup lang="ts">
import type { Workorder } from '~/types'
const props = defineProps<{ workorder: Workorder; disabled: boolean; saved: boolean }>()
const emit = defineEmits<{
  (e: 'update:dirty', value: boolean): void
}>()
const { update } = useMainStore()
const wo = useVModel(props, 'workorder', emit)
let isDirty = $ref(false)

collectDirt($$(props.workorder), $$(isDirty))

watchEffect(() => emit('dirty', isDirty))
watchEffect(() => {
  if (props.saved && isDirty) {
    update({ table: 'workorders', data: props.workorder })
    isDirty = false
  }
})
</script>

<template>
  <div flex="~ col" gap4>
    <div flex justify-between z10>
      <StatusPicker v-model:status="wo.status" :options="workorderStatusOptions" :saved="saved" :disabled="disabled" />

      <EmployeePicker v-model:id="wo['FK|employee_id']" :disabled="disabled" :saved="saved" />
    </div>

    <section class="flex gap-x-4">
      <ProjectInfo v-model:workorder="wo" :disabled="disabled" :saved="saved" />

      <Card w="1/2" flex="~ col" gap4>
        <h3 class="text-h4">
          Work Order Info
        </h3>

        <DatePicker v-model:date="wo.start_date" :saved="saved" :disabled="disabled" />

        <DatePicker v-model:date="wo.due_date" :saved="saved" :disabled="disabled" />

        <div class="flex gap-x-4">
          <JobTypePicker v-model:type="wo.job_type" :options="jobTypeOptions" :disabled="disabled" :saved="saved" />

          <BillTypePicker v-model:type="wo.bill_type" :options="billingOptions" :disabled="disabled" :saved="saved" />
        </div>
      </Card>
    </section>

    <section>
      <Card w-full flex="~ col" gap4>
        <div text-h5>
          Description
        </div>
        <div v-if="disabled" v-html="parseDelta(wo.description)" />
        <Editor
          v-else
          v-model:content="wo.description"
          :data="wo.description"
          label="Description"
          :disabled="disabled"
          place-holder-text="Description"
        />

        <div text-h5>
          Notes
        </div>
        <div v-if="disabled" v-html="parseDelta(wo.notes)" />
        <Editor
          v-else
          v-model:content="wo.notes"
          :data="wo.notes"
          label="Description"
          :disabled="disabled"
          place-holder-text="Description"
        />

        <div text-h5>
          Parking Info
        </div>
        <div v-if="disabled" v-html="parseDelta(wo.parking_info)" />
        <Editor
          v-else
          v-model:content="wo.parking_info"
          :data="wo.parking_info"
          label="Description"
          :disabled="disabled"
          place-holder-text="Description"
        />
      </Card>
    </section>
  </div>
</template>
