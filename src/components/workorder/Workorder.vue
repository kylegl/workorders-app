<script setup lang="ts">
import type { ParsedWorkorderType } from '~/types'
const { workorder } = defineProps<{ workorder: ParsedWorkorderType }>()
const { loadWo } = useWoStore()

const startDate = $computed(() => shortDate(workorder?.start_date))
const dueDate = $computed(() => shortDate(workorder?.due_date))
const job = $computed(() => workorder?.['FK|job_id'])
const employee = $computed(() => workorder?.['FK|employee_id'])
const client = $computed(() => workorder?.['FK|client_id'])
</script>

<template>
  <router-link :to="{ name: 'workorders-id', params: { id: workorder.id } }" w-full>
    <Card flex bg-1 text-norm @click="loadWo(workorder.id)">
      <div flex gap4 min-h-25 w-full>
        <!-- WORKORDER INFO -->
        <div
          flex="~ col" gap2 justify-center w-50 shrink-0
          text-h5
        >
          <StatusIndicator :status="workorder.status" text-h4 />
          <JobDates :has-dates="!!startDate || !!dueDate">
            <span v-if="startDate || dueDate" flex gap=".5" items-center>
              <div v-if="startDate">{{ startDate }}</div>
              <X v-else />
              <div i-ion:arrow-right-b text-muted text-base />
              <div v-if="dueDate">{{ dueDate }}</div>
            </span>
          </JobDates>

          <Assigned :is-assigned="!!employee" :person="employee" />
        </div>

        <Divider w=".25" h-full/>

        <!-- INFO -->
        <div flex="~ col" gap2 w-full overflow-hidden>
          <div flex gap4 text-h4 items-baseline>
            <div v-if="client?.name" highlight min-w-fit wrap>
              {{ client?.name }}
            </div>
            <div min-w-0 truncate>
              <template v-if="job?.job_name">
                <span>
                  {{ job?.job_name }}
                </span>
              </template>
              <template v-if="job?.address">
                <Icon
                  v-if=" job?.job_name && job?.address"
                  inline-block text-xs mx2 my-auto
                  i-fa6-solid:house
                />
                <span>
                  {{ job?.address }}
                </span>
              </template>
            </div>

            <div self-start text-base ml-auto shrink-0>
              <div>
                {{ job?.job_number }}
              </div>
              <div float-right text-sm>
                #{{ workorder?.wo_number }}
              </div>
            </div>
          </div>

          <div text-h5 my-auto line-clamp-3 v-html="parseDelta(workorder?.description)" />
        </div>
      </div>
    </Card>
  </router-link>
</template>
