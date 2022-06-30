<script setup lang="ts">
import type { Employee, ParsedWorkorderType } from '~/types'
import { useWoStore } from '~/stores/wo/useWoStore'
const { workorder } = defineProps<{ workorder: ParsedWorkorderType }>()
const { loadWo } = useWoStore()

const startDate = $computed(() => shortDate(workorder?.start_date))
const dueDate = $computed(() => shortDate(workorder?.due_date))
</script>

<template>
  <router-link :to="{ name: 'workorders-id', params: { id: workorder.id } }" w-full>
    <Card @click="loadWo(workorder.id)" bg-1>
      <div flex gap4 min-h-25 w-full>
        <!-- WORKORDER INFO -->
        <div flex="~ col" gap2 justify-center w-50 h-full>
          <StatusIndicator :status="workorder.status" text-h4 />
          <div flex gap2 text-muted font-semibold w-full>
            <Icon i-carbon:calendar text-xl />
            <span>{{ `${startDate} - ${dueDate}` }}</span>
          </div>
          <div flex gap2 text-muted font-semibold w-full>
            <Icon i-mdi:account-hard-hat-outline text-xl />
            <span>{{ workorder?.['FK|employee_id']?.name }}</span>
          </div>
        </div>

        <!-- DIVIDER -->
        <div w=".25" bg-3 op30 />

        <!-- INFO -->
        <div flex="~ col" max-h-auto gap2 w-full>
          <div flex w-full>
            <div flex gap4 text-h4 items-center min-w-full >
              <div bg-fg-lit-muted dark:bg-fg-drk-muted text-fg-drk-norm dark:text-fg-lit-norm py1 px2 rounded shadow-sm>
                {{ workorder?.['FK|client_id']?.name }}
              </div>
              <template v-if="workorder?.['FK|job_id']?.job_name">
                <span shrink-0 text-h5>{{ workorder?.['FK|job_id']?.job_name }}</span>
              </template>
              <template v-if="workorder?.['FK|job_id']?.address">
                <div flex gap1 items-baseline w-full min-w-min>
                  <Icon i-fa6-solid:house text-xs />
                  <span min-w-min text-h5  truncate>{{ workorder?.['FK|job_id']?.address }}</span>
                </div>
              </template>
              <div text-muted text-base ml-auto>#{{workorder?.wo_number}}</div>
            </div>
          </div>

          <div text-muted font-semibold text-ellipsis overflow-hidden>
            {{ workorder?.description }}
          </div>

        </div>
      </div>
    </Card>
  </router-link>
</template>
