<script setup lang="ts">
import { usePrintStore } from '~/stores/wo/usePrintStore'
const { getByKeyValue } = useMainStore()
const { printValues } = storeToRefs(usePrintStore())

const tasks = $computed(() => getByKeyValue({ key: 'FK|workorder_id', value: printValues.value.id, type: 'line_items' })
  .sort((a: Lineitem, b: Lineitem) => a.item_number! - b.item_number!))
</script>

<template>
  <div>
    <div id="printMe" flex="~ col" gap-y-4 p8>
      <section class="flex gap-x-4">
        <div w="1/2" flex="~ col" gap4>
          <h4>
            Client
          </h4>
          <div>
            {{ printValues.client }}
          </div>
          <h4>
            Job # {{ printValues.job?.job_number }}
          </h4>
          <div>{{ printValues.job?.job_name || printValues.job?.address }}</div>
          <h4>
            Contact
          </h4>
          <div>
            <span>{{ printValues.contact?.name }}</span>   <span>Phone # {{ printValues.contact?.phone }}</span>
          </div>
          <div />
        </div>
        <hr/>
        <Card w="1/2" flex="~ col" gap4>
          <h3 class="text-h4">
            Work Order Info
          </h3>

          <h5>Assigned To: {{printValues.employee.name}}</h5>

          <div>Start Date:   {{ printValues.startDate }}</div>

          <div>Due Date:   {{ printValues.dueDate }}</div>

          <template v-if="printValues?.description">
            <h3>Description</h3>
            <div v-html="parseDelta(printValues.description)" />
          </template>

          <template v-if="printValues?.notes">
            <h3>Notes</h3>
            <div v-html="parseDelta(printValues.notes)" />
          </template>

          <template v-if="printValues?.parkingInfo">
            <h3>Parking Info</h3>
            <div v-html="parseDelta(printValues.parkingInfo)" />
          </template>
          <hr>

          <h4>Line Items</h4>
          <div v-for="task in tasks" :key="task.id">
              <template v-if="task?.item_number">
                <h5>
                  # {{ task.item_number }}
                </h5>
              </template>
            <span>
              <template v-if="task?.description">
                <h5>
                  Description
                </h5>
                <div v-html="parseDelta(task.description)" />
              </template>
            </span>
            <span>
              <template v-if="task?.details">
                <h5>
                  Details
                </h5>
                <div v-html="parseDelta(task.details)" />
              </template>
            </span>

            <template v-if="task?.quantity">
              <h5>
                Quantity
              </h5>
              <div v-html="parseDelta(task.quantity)" />
            </template>
            <template v-if="task?.notes">
              <h5>
                Notes
              </h5>
              <div bg-transparent v-html="parseDelta(task.notes)" />
            </template>
            <hr>
          </div>
        </card>
      </section>
    </div>
  </div>
</template>
