<script setup lang="ts">
import type { JobType } from '~/types'
const { job } = defineProps<{ job: JobType }>()
const startDate = $computed(() => shortDate(job?.start_date) || 'Not Set')
const contact = $computed(() => job?.['FK|contact_id'])
</script>

<template>
  <router-link :to="{ name: 'jobs-id', params: { id: job.id } }" w-full>
    <Card bg-1 text-norm>
      <div flex gap4 min-h-25 w-full>
        <!-- WORKORDER INFO -->
        <div
          flex="~ col" gap2 w-50 shrink-0
          text-h5
        >
          <StatusIndicator :status="job.status" text-h4 />
          <div flex gap2 w-full items-center>
            <Icon i-carbon:calendar text-xl />
            <span>{{ startDate }}</span>
          </div>
          <div v-if="contact?.name" flex gap2 w-full>
            <Icon i-mdi:account-hard-hat-outline text-xl />
            <span >{{ contact?.name }}</span>
          </div>
        </div>

<<<<<<< HEAD
        <Divider w=".25" />

=======
>>>>>>> c9dda15885ed1e790739e2ba6c9f305a60b48e0a
        <!-- INFO -->
        <div flex="~ col" gap2 w-full overflow-hidden>
          <div flex gap4 text-h4 items-baseline>
            <div highlight min-w-fit wrap>
              {{ job?.['FK|client_id']?.name }}
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
              #{{ job?.job_number }}
            </div>
          </div>

        </div>
      </div>
    </Card>
  </router-link>
</template>
