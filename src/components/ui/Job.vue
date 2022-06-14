<script setup lang="ts">
import type { Job } from '~/types'
const { job } = defineProps<{ job: Job }>()
const { data, loading, error } = storeToRefs(useMainStore())
const { getById } = useMainStore()
</script>

<template>
  <router-link :to="{ name: 'jobs-id', params: { id: job.id } }" w-full>
    <Card>
      <div flex gap3 min-h-25>
        <div flex="~ col" justify-between w-28>
          <div flex gap2 items-center text-sm>
            <StatusIndicator :status="job.status" />
          </div>
          <div text-h5>
            {{ job.job_number }}
          </div>
          <div>
            <div>
              Client
            </div>
            <div text-h5>
              {{ job['FK|client_id']?.name }}
            </div>
          </div>
        </div>

        <div flex="~ col" w-50>
          <div v-if="job?.job_name">
            Name
          </div>
          <div v-if="job?.job_name" text-h5>
            {{ job.job_name }}
          </div>
          <div v-if="job?.address">
            Address
          </div>
          <div v-if="job?.address" text-h5>
            {{ job.address }}
          </div>
        </div>

      </div>
    </Card>
  </router-link>
</template>
