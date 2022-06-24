<script setup lang="ts">
import { usePrintStore } from '~/stores/wo/usePrintStore'

const { printValues } = storeToRefs(usePrintStore())

const wo = $computed(() => printValues)
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
            Job # {{ printValues.job.job_number }}
          </h4>
          <h5>{{ printValues.job?.job_name || printValues.job.address }}</h5>
          <h4>
            Contact
          </h4>
          <div>
            <span>{{ printValues.contact.name }}</span>   <span>Phone # {{ printValues.contact.phone }}</span>
          </div>
          <div />
        </div>

        <Card w="1/2" flex="~ col" gap4>
          <h3 class="text-h4">
            Work Order Info
          </h3>

          <div>Start Date:   {{ printValues.startDate }}</div>

          <div>Due Date:   {{ printValues.dueDate }}</div>

          <template v-if="printValues?.description">
            <h3>Description</h3>
            <div v-html="parseDelta(printValues.description)" />
          </template>

          <template v-if="printValues?.details">
            <h3>Details</h3>
            <div v-html="parseDelta(printValues.details)" />
          </template>

          <template v-if="printValues?.notes">
            <h3>Details</h3>
            <div v-html="parseDelta(printValues.notes)" />
          </template>

          <template v-if="printValues?.parkingInfo">
            <h3>Details</h3>
            <div v-html="parseDelta(printValues.parkingInfo)" />
          </template>

          <h3>Line Items</h3>
          <div v-for="task in printValues.tasks" :key="task.id">
            <span>
              <h4>
                Description
              </h4>
              <template v-if="task?.description">
                <div v-html="parseDelta(task.description)" />
              </template>
            </span>
            <span>
              <h4>
                Details
              </h4>
              <template v-if="task?.details">
                <div v-html="parseDelta(task.details)" />
              </template>
            </span>

            <h4>
              Quantity
            </h4>
            <template v-if="task?.quantity">
              <div v-html="parseDelta(task.quantity)" />
            </template>
            <h4>
              Notes
            </h4>
            <template v-if="task?.notes">
              <div v-html="parseDelta(task.notes)" />
            </template>
          </div>
        </card>
      </section>
    </div>
  </div>
</template>
