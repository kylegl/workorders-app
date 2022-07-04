<script setup lang="ts">
import type { ParsedWorkorderType } from '~/types'
const { workorder } = defineProps<{ workorder: ParsedWorkorderType }>()
const { loadWo } = useWoStore()

const startDate = $computed(() => shortDate(workorder?.start_date) || 'Not Set')
const dueDate = $computed(() => shortDate(workorder?.due_date) || 'Not Set')
const dateString = $computed(() => startDate !== 'Not Set' && dueDate !== 'Not Set' ?`${startDate} - ${dueDate}` : 'Not Set')
const job = $computed(() => workorder?.['FK|job_id'])
const employee = $computed(() => workorder?.['FK|employee_id'])
</script>

<template>
  <router-link :to="{ name: 'workorders-id', params: { id: workorder.id } }" w-full>
    <Card bg-1 text-norm @click="loadWo(workorder.id)">
      <div flex gap4 min-h-25 w-full>
        <!-- WORKORDER INFO -->
        <div
          flex="~ col" gap2 justify-center w-50 shrink-0
          text-h5
        >
          <StatusIndicator :status="workorder.status" text-h4 />
          <div flex gap2 w-full items-center>
            <Icon i-carbon:calendar text-xl />
            <span>{{ dateString}}</span>
          </div>
          <div flex gap2 w-full>
            <Icon i-mdi:account-hard-hat-outline text-xl />
            <span v-if="employee?.name">{{ employee?.name }}</span>
            <span v-else text-red>Not Assigned</span>
          </div>
        </div>

        <Divider w="1" />

        <!-- INFO -->
        <div flex="~ col" gap2 w-full overflow-hidden>
          <div flex gap4 text-h4 items-baseline>
            <div highlight min-w-fit wrap>
              {{ workorder?.['FK|client_id']?.name }}
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
              #{{ workorder?.wo_number }}
            </div>
          </div>

          <div text-h5 my-auto line-clamp-3 v-html="parseDelta(workorder?.description)" />
        </div>
      </div>
    </Card>
  </router-link>
</template>
