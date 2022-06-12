<script setup lang="ts">
import type { WorkorderParsed } from '~/api/apiResponseTypes'
const { data, loading, error } = storeToRefs(useMainStore())
const { getById, getReadableDate } = useMainStore()
const route = useRoute()
const id = route.params?.id

let workorder = $ref({} as WorkorderParsed)

const statusOptions = ['Upcoming', 'In-progress', 'Completed', 'On-hold', 'Cancelled']
const billingOptions = ['T&M', 'Fixed']
const jobTypeOptions = ['Finishing', 'Painting']

onBeforeMount(() => {
  workorder = getById({ id, type: 'workorders' })
})

let formDisabled = $ref(true)

const toggleForm = () => {
  formDisabled = !formDisabled
}
const startDate = $ref('')
const dueDate = $ref('')

onMounted(() => {
  const startDateTimestamp = $toRef(workorder, 'start_date')
  const dueDateTimestamp = $toRef(workorder, 'due_date')

  getReadableDate({ timestamp: $$(startDateTimestamp), readable: $$(startDate) })
  getReadableDate({ timestamp: $$(dueDateTimestamp), readable: $$(dueDate) })
})
</script>

<template>
  <div class="flex flex-col gap-y-4 p-8">
    <div class="flex justify-between">
      <h1 class="text-h3">
        {{ `Work Order #` }}
      </h1>

      <Button class="" @click="toggleForm">
        Edit
      </Button>
    </div>

    <!-- HEADER -->
    <div class="flex justify-between">
      <div class="flex gap-x-4">
        <Select
          v-model="workorder.status"
          label="Status"
          :list="statusOptions"
        />
      </div>

      <div class="flex gap-x-4">
        <Datalist
          v-model="workorder['FK|employee_id']"
          label="Assigned To"
          type="employees"
          :list="data.employees"
          :search-keys="['name']"
          :show-keys="['name', 'position']"
          :disabled="formDisabled"
        />
      </div>
    </div>

    <section class="flex gap-x-4">
      <!-- JOB INFO -->
      <div class="flex flex-col gap-y-4 w-1/2 border rounded p-4">
        <h3 class="text-h4">
          Project Info
        </h3>
        <Datalist
          v-model="workorder['FK|client_id']"
          type="clients"
          :list="data.clients"
          :search-keys="['name']"
          :show-keys="['name']"
          label="Client"
          class="z-3"
          :disabled="formDisabled"
        />

        <Datalist
          v-model="workorder['Fk|job_id']"
          type="jobs"
          :list="data.jobs"
          :search-keys="['job_name', 'address']"
          :show-keys="['job_name', 'address']"
          class="z-2"
          label="Job"
          :disabled="formDisabled"
        />

        <Datalist
          v-model="workorder['FK|contact_id']"
          type="contacts"
          :list="data.contacts"
          :search-keys="['name']"
          :show-keys="['name']"
          class="z-1"
          label="Contact"
          :disabled="formDisabled"
        />
      </div>

      <!-- WORKORDER INFO -->
      <div class="flex flex-col gap-y-4 w-1/2 border rounded p-4">
        <h3 class="text-h4">
          Work Order Info
        </h3>
        <Input
          v-model="startDate"
          label="Start Date"
          type="date"
          :disabled="formDisabled"
          place-holder-text="Start date"
        />
        <Input
          v-model="dueDate"
          label="Due Date"
          type="date"
          :disabled="formDisabled"
          place-holder-text="Start date"
        />
        <div class="flex gap-x-4">
          <Select
            v-model="workorder.job_type"
            label="Job Type"
            :list="jobTypeOptions"
            :disabled="formDisabled"
          />
          <Select
            v-model="workorder.bill_type"
            label="Billing Type"
            :list="billingOptions"
            :disabled="formDisabled"
          />
        </div>
      </div>
    </section>

    <!-- DESCRIPTION -->
    <section>
      <div class="flex flex-col gap-y-4 border rounded p-4">
        <Input
          v-model="workorder.description"
          label="Description"
          :disabled="formDisabled"
          place-holder-text="Description"
          type="text"
        />
        <Input
          v-model="workorder.notes"
          label="Notes"
          :disabled="formDisabled"
          place-holder-text="Notes"
          type="text"
        />
        <Input
          v-model="workorder.parking_info"
          label="Parking Info"
          :disabled="formDisabled"
          place-holder-text="Parking info"
          type="text"
        />
      </div>
    </section>

    <!-- LINE ITEMS -->
    <section class="flex flex-col gap-y-4">
      <Tasks :workorder-id="id" />
    </section>
  </div>
</template>
