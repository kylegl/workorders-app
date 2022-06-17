<script setup lang="ts">
import type { WorkorderParsed } from '~/api/apiResponseTypes'
const { data, loading, error } = storeToRefs(useMainStore())
const { getById, getReadableDate, update } = useMainStore()
const route = useRoute()
const id = route.params?.id
const startDate = $ref('')
const dueDate = $ref('')
let formDisabled = $ref(true)
let isSaved = $ref(false)
const isDirty = $ref(false)

const workorder = getById({ id, type: 'workorders' })

const edit = () => {
  formDisabled = false
  isSaved = false
}

const save = () => {
  formDisabled = true
  isSaved = true
}

onMounted(() => {
  const startDateTimestamp = $toRef(workorder, 'start_date')
  const dueDateTimestamp = $toRef(workorder, 'due_date')
  getReadableDate({ timestamp: $$(startDateTimestamp), readable: $$(startDate) })
  getReadableDate({ timestamp: $$(dueDateTimestamp), readable: $$(dueDate) })
})

// TODO Need to get this setup to update the db
// after this is setup. check update, delete, add, etc. Then pull line items from jobs and bids.
// after that setup print work order
// then setup auto sync between this and the db.
const test = () => $$(isDirty).value = true

watchAfterInit($$(workorder), test, { deep: true })

watchEffect(() => {
  if (isDirty && isSaved) update({ type: 'workorders', data: workorder })
})

const descriptionHtml = $computed(() => parseDelta(workorder.description))
</script>

<template>
  <div flex="~ col" gap-y-4 p8 relative>
    <div flex justify-between>
      <h1 text-h3>
        {{ `Work Order #` }}
      </h1>

      <Button v-if="formDisabled" text-h5 @click="edit">
        <Icon i-ion:edit text-2xl icon-btn />
        edit
      </Button>
      <Button v-else text-h5 @click="save">
        <Icon i-carbon:save text-2xl icon-btn />
        Save
      </Button>
    </div>

    <!-- HEADER -->
    <div flex justify-between z10>
      <div flex gap4>
        <Select
          v-model="workorder.status"
          label="Status"
          :list="workorderStatusOptions"
        />
      </div>

      <div flex gap4>
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
      <Card w="1/2" flex="~ col" gap4>
        <h3 text-h4>
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
          v-model="workorder['FK|job_id']"
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
      </Card>

      <!-- WORKORDER INFO -->

      <Card w="1/2" flex="~ col" gap4>
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
      </Card>
    </section>

    <!-- DESCRIPTION -->
    <section>
      <Card w-full flex="~ col" gap4>
        <div text-h5>
          Description
        </div>
        <div v-if="formDisabled" v-html="descriptionHtml" />
        <Editor
          v-else
          v-model:content="workorder.description"
          :data="workorder.description"
          label="Description"
          :disabled="formDisabled"
          place-holder-text="Description"
        />

        <div text-h5>
          Notes
        </div>
        <div v-if="formDisabled">
          {{ workorder.notes }}
        </div>
        <Editor
          v-else
          v-model:content="workorder.notes"
          :data="workorder.notes"
          label="Description"
          :disabled="formDisabled"
          place-holder-text="Description"
        />

        <div text-h5>
          Parking Info
        </div>
        <div v-if="formDisabled">
          {{ workorder.parking_info }}
        </div>
        <Editor
          v-else
          v-model:content="workorder.parking_info"
          :data="workorder.parking_info"
          label="Description"
          :disabled="formDisabled"
          place-holder-text="Description"
        />
      </Card>
    </section>

    <!-- LINE ITEMS -->
    <Tasks :workorder-id="id" />
  </div>
</template>
