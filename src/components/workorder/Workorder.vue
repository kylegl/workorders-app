<script setup lang="ts">
import type { ParsedWorkorderType } from '~/types'
import { useWoStore } from '~/stores/wo/useWoStore'
const { workorder } = defineProps<{ workorder: ParsedWorkorderType }>()
const { loadWo } = useWoStore()

const startDate = $computed(() => shortDate(workorder?.start_date))
const dueDate = $computed(() => shortDate(workorder?.due_date))
const job = $computed(() => workorder?.['FK|job_id'])
const employee = $computed(() => workorder?.['FK|employee_id'])
</script>

<template>
  <router-link :to="{ name: 'workorders-id', params: { id: workorder.id } }" w-full>
    <Card bg-1 text-muted @click="loadWo(workorder.id)">
      <div flex gap4 min-h-25 w-full>
        <!-- WORKORDER INFO -->
        <div
          flex="~ col" gap2 justify-center w-50 shrink-0
          font-semibold
        >
          <StatusIndicator :status="workorder.status" text-h4 />
          <div
            flex gap2 w-full items-center
            text-sm
          >
            <Icon i-carbon:calendar text-xl />
            <span>{{ `${startDate} - ${dueDate}` }}</span>
          </div>
          <div flex gap2 w-full>
            <Icon i-mdi:account-hard-hat-outline text-xl />
            <span v-if="employee?.name">{{ employee?.name }}</span>
            <span v-else text-red>Not Assigned</span>
          </div>
        </div>

        <Divider w=".25" />

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

          <div font-semibold my-auto line-clamp-3>
            {{ workorder?.description }}
          </div>
        </div>
      </div>
    </Card>
  </router-link>
</template>
