<script setup lang="ts">
import { parseTimestamptoInputFormat } from '~/composables'

const { getWorkorder, getById } = useWorkorderStore()
const { employees } = storeToRefs(useEmployeeStore())

const route = useRoute()

const workorder = reactive({
  data: undefined,
  rawData: undefined,
  lineItems: undefined,
})

const startDate = ref('')
const dueDate = ref('')
const formDisabled = ref(true)
const statusOptions = reactive(['Upcoming', 'In-progress', 'Completed', 'On-hold', 'Cancelled'])

onBeforeMount(() => {
  workorder.rawData = getById(parseInt(route.params.id))
  workorder.data = getWorkorder(parseInt(route.params.id))
  startDate.value = parseTimestamptoInputFormat(workorder.rawData.start_date)
  dueDate.value = parseTimestamptoInputFormat(workorder.rawData.due_date)
})

const toggleForm = () => {
  formDisabled.value = !formDisabled.value
}
// const go = () => {
//   console.log(tableValues({ headers: lineItemTableHeaders, values: workorder.lineItems }))
// }

// const lineItemTableHeaders = [
//   {
//     key: 'completed',
//     title: 'Completed',
//   },
//   {
//     key: 'item_number',
//     title: '#',
//   },
//   {
//     key: 'description',
//     title: 'Description',
//   },
//   {
//     key: 'details',
//     title: 'Material/Color/Sheen',
//   },
//   {
//     key: 'quantity',
//     title: 'QTY',
//   },
//   {
//     key: 'hours',
//     title: 'HRS',
//   },
//   {
//     key: 'notes',
//     title: 'Notes',
//   },
// ]

// const tableValues = ({ headers, values }) => {
//   return values.map(entry => Object.fromEntries(headers.reduce((row, header) => {
//     row = [...row, [header.key, entry[header.key]]]
//     return row
//   }, [])))
// }

// const getTableValues = computed(() => {
//   return tableValues({ headers: lineItemTableHeaders, values: workorder.lineItems })
// })
</script>

<template>
  <div class="flex flex-col gap-y-4 p-8">
    <div class="flex justify-between">
      <h1 class="text-h3">
        {{ `Work Order #${workorder.data.id}` }}
      </h1>

      <Button class="" @click="toggleForm">
        Edit
      </Button>
    </div>

    <!-- {{ workorder.data }} -->
    {{Array.isArray(statusOptions)}}

    <!-- HEADER -->
    <div class="flex justify-between">
      <div class="flex gap-x-4">
        <h3 class="text-h4">
          Status
        </h3>
        <Select
          v-model="workorder.data.status"
          :options="statusOptions"
        />
      </div>

      <div class="flex gap-x-4">
        <h3 class="text-h4">
          Assigned To
        </h3>
        <Select
          v-model="workorder.data.employee"
          :options="employees.map(employee => employee.name)"
        />
      </div>
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
          :disabled="formDisabled"
          place-holder-text="Client"
        />
        <Input
          v-model="workorder.data.job"
          label="Job Number"
          :disabled="formDisabled"
          place-holder-text="Job Number"
        />
        <Input
          v-model="workorder.data.contact"
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
          <Input
            v-model="workorder.data.job_type"
            label="Job Type"
            type="select"
            :disabled="formDisabled"
            selected="Painting"
          />
          <Input
            v-model="workorder.data.bill_type"
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
        v-model="workorder.data.description"
        label="Description"
        :disabled="formDisabled"
        place-holder-text="Description"
        type="text"
      />
      <Input
        v-model="workorder.data.notes"
        label="Notes"
        :disabled="formDisabled"
        place-holder-text="Notes"
        type="text"
      />
      <Input
        v-model="workorder.data.parking_info"
        label="Parking Info"
        :disabled="formDisabled"
        place-holder-text="Parking info"
        type="text"
      />
    </div>

    <section class="flex flex-col gap-y-4">
      <!-- <lineItemTable :headers="lineItemTableHeaders" :data="getTableValues" /> -->
    </section>
  </div>
</template>
