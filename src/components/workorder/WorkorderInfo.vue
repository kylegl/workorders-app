<script setup lang="ts">
const { wo, state } = storeToRefs(useWoStore())
</script>

<template>
  <div flex="~ col" gap4>
    <template v-if="wo">
      <div flex justify-between z10>
        <StatusPicker v-model:status="wo.status" :options="woStatuses" :disabled="state.saved" />

        <EmployeePicker v-model:value="wo['FK|employee_id']" :disabled="state.saved" min-w-75 />
      </div>

      <section class="flex gap4" items-start>
        <ProjectInfo v-model:workorder="wo" :disabled="state.saved" bg-2 w="1/3" shrink-0 min-h-122 />

        <Card flex="~ col" w-full gap4 bg-2 min-h-122>
          <div flex gap4 justify-between>
            <DatePicker v-model:date="wo.start_date" :disabled="state.saved" label="Start Date" />
            <DatePicker v-model:date="wo.due_date" :disabled="state.saved" label="Due Date" />
          </div>
          <div flex="~ col">
            <div text-h5>
              Description
            </div>
            <div v-if="state.saved" v-html="parseDelta(wo.description)" />
            <Editor
              v-else
              v-model:content="wo.description"
              :data="wo.description"
              label="Description"
              :disabled="state.saved"
              place-holder-text="Description"
              flex="~ col"
            />

            <div text-h5>
              Notes
            </div>
            <div v-if="state.saved" v-html="parseDelta(wo.notes)" />
            <Editor
              v-else
              v-model:content="wo.notes"
              :data="wo.notes"
              label="Description"
              :disabled="state.saved"
              place-holder-text="Description"
              flex="~ col"
            />

            <div text-h5>
              Parking Info
            </div>
            <div v-if="state.saved" v-html="parseDelta(wo.parking_info)" />
            <Editor
              v-else
              v-model:content="wo.parking_info"
              :data="wo.parking_info"
              label="Description"
              :disabled="state.saved"
              place-holder-text="Description"
              flex="~ col"
            />
          </div>
        </Card>
      </section>
    </template>
  </div>
</template>
