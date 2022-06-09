<script setup lang="ts">
import type { WorkorderParsed } from '~/api/apiResponseTypes'
const { data, loading, error } = storeToRefs(useMainStore())
const { getById } = useMainStore()
const route = useRoute()

let workorder = $ref({} as WorkorderParsed)

const statusOptions = ['Upcoming', 'In-progress', 'Completed', 'On-hold', 'Cancelled']

onBeforeMount(() => {
  workorder = getById({ id: route.params?.id, type: 'workorders' })
})

let formDisabled = $ref(true)

const toggleForm = () => {
  formDisabled = !formDisabled
}
</script>

<template>
  <div class="flex flex-col gap-y-4 p-8">
    <div class="flex justify-between">
      <h1 class="text-h3">
        {{ `Work Order #${workorder?.id}` }}
      </h1>

      <Button class="" @click="toggleForm">
        Edit
      </Button>
    </div>

    <!-- HEADER -->
    <div class="flex justify-between">
      <div class="flex gap-x-4">
        <h3 class="text-h4">
          Status
        </h3>
        <Select
          v-model="workorder.status"
          :options="statusOptions.map(status => ({ value: status, display: status }))"
        />
      </div>

      <div class="flex gap-x-4">
        <Datalist
          v-model="workorder['FK|employee_id']"
          type="employees"
          :list="data.employees"
          :search-keys="['name']"
          :show-keys="['name', 'position']"
        />
        <!-- <Select
          v-model="workorder.employee_id.name"
          label="Assigned To"
          :options="data.employees.map(employee => ({ value: employee.id, display: employee.name }))"
        /> -->
      </div>
    </div>

    <section class="flex gap-x-4">
      <!-- JOB INFO -->
      <div class="flex flex-col w-1/2 border rounded p-4">
        <h3 class="text-h4">
          Project Info
        </h3>
        <!-- <Select
          v-model="workorder.client_id.name"
          label="Client"
          :options="data.clients.map(client => ({ value: client.id, display: client.name }))"
        /> -->
        <Input
          v-model="workorder.job_id"
          label="Job Number"
          :disabled="formDisabled"
          place-holder-text="Job Number"
        />
        <Input
          v-model="workorder.contact_id"
          label="Contact"
          :disabled="formDisabled"
          place-holder-text="Contact"
        />
      </div>

      <!-- WORKORDER INFO -->
      <div class="flex flex-col w-1/2 border rounded p-4">
        <h3 class="text-h4">
          Work Order Info
        </h3>
        <Input
          v-model="workorder.start_date"
          label="Start Date"
          type="date"
          :disabled="formDisabled"
          place-holder-text="Start date"
        />
        <Input
          v-model="workorder.due_date"
          label="Due Date"
          type="date"
          :disabled="formDisabled"
          place-holder-text="Start date"
        />
        <div class="flex gap-x-4">
          <Input
            v-model="workorder.job_type"
            label="Job Type"
            type="select"
            :disabled="formDisabled"
            selected="Painting"
          />
          <Input
            v-model="workorder.bill_type"
            label="Billing Type"
            type="select"
            :disabled="formDisabled"
            selected="Fixed"
          />
        </div>
      </div>
    </section>

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

    <section class="flex flex-col gap-y-4">
      <!-- <lineItemTable :headers="lineItemTableHeaders" data="getTableValues" /> -->
      {{ workorder }}
    </section>
  </div>
</template>
