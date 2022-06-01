<script setup lang="ts">
import { parseTimestamptoInputFormat } from '~/composables'

const { getWorkorder, getById } = useWorkorderStore()
const route = useRoute()

const workorder = reactive({
  data: undefined,
  rawData: undefined,
})
const startDate = ref('')
const dueDate = ref('')

onBeforeMount(() => {
  workorder.rawData = getById(parseInt(route.params.id))
  workorder.data = getWorkorder(parseInt(route.params.id))
  startDate.value = parseTimestamptoInputFormat(workorder.rawData.start_date)
  dueDate.value = parseTimestamptoInputFormat(workorder.rawData.due_date)
})
const go = () => {
  console.log(parseTimestamptoInputFormat(workorder.rawData.start_date))
}
</script>

<template>
  <div class="flex flex-col gap-y-4 p-8">
    <h1 class="text-h3">
      {{ `Work Order #${workorder.data.id}` }}
    </h1>
    <!-- {{ workorder.data }} -->

    <div class="flex justify-between">
      <h3 class="text-h4">
        Status
      </h3>
      <Input
        v-model="workorder.data.status"
        class="max-w-content"
        type="select"
        :disabled="true"
        selected="Upcoming"
      />
      <h3 class="text-h4">
        Assigned To
      </h3>
      <Input
        v-model="workorder.data.employee"
        class="max-w-content"
        type="select"
        :disabled="true"
      />
    </div>

    <section class="flex gap-x-4">
      <!-- JOB INFO -->
      <div class="flex flex-col w-1/2 border rounded p-4">
        <h3 class="text-h4">
          Project Info
        </h3>
        <Input
          v-model="workorder.data.client"
          label="Client"
          :disabled="true"
          place-holder-text="Client"
        />
        <Input
          v-model="workorder.data.job"
          label="Job Number"
          :disabled="true"
          place-holder-text="Job Number"
        />
        <Input
          v-model="workorder.data.contact"
          label="Contact"
          :disabled="true"
          place-holder-text="Contact"
        />
      </div>

      <!-- WORKORDER INFO -->
      <div class="flex flex-col w-1/2 border rounded p-4">
        <h3 class="text-h4">
          Work Order Info
        </h3>
        <Input
          v-model="startDate"
          label="Start Date"
          type="date"
          :disabled="true"
          place-holder-text="Start date"
        />
        <Input
          v-model="dueDate"
          label="Due Date"
          type="date"
          :disabled="true"
          place-holder-text="Start date"
        />
        <div class="flex gap-x-4">
          <Input
            v-model="workorder.data.job_type"
            label="Job Type"
            type="select"
            :disabled="true"
            selected="Painting"
          />
          <Input
            v-model="workorder.data.bill_type"
            label="Billing Type"
            type="select"
            :disabled="true"
            selected="Fixed"
          />
        </div>
      </div>
    </section>

    <div class="flex flex-col gap-y-4 border rounded p-4">
      <Input
        v-model="workorder.data.description"
        label="Description"
        :disabled="true"
        place-holder-text="Description"
        type="text"
      />
      <Input
        v-model="workorder.data.notes"
        label="Notes"
        :disabled="true"
        place-holder-text="Notes"
        type="text"
      />
      <Input
        v-model="workorder.data.parking_info"
        label="Parking Info"
        :disabled="true"
        place-holder-text="Parking info"
        type="text"
      />
    </div>
  </div>
</template>
