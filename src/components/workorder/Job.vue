<script setup lang="ts">
import type { ContactType, JobParsedType } from '~/types'
const { job } = defineProps<{ job: JobParsedType }>()
const startDate = $computed(() => shortDate(job?.start_date))
const contact = $computed((): ContactType => job?.['FK|contact_id'])
</script>

<template>
  <router-link :to="{ name: 'jobs-id', params: { id: job.id } }" w-full>
    <Card bg-1 flex text-norm>
      <div flex gap4 min-h-25 w-full>
        <!-- WORKORDER INFO -->
        <div
          flex="~ col" gap2 w-50 shrink-0
          text-h5
        >
          <StatusIndicator :status="job.status" text-h4 />
          <JobDates :has-dates="!!startDate">
            <div v-if="startDate">
              {{ startDate }}
            </div>
          </JobDates>

          <Assigned v-if="contact" :is-assigned="!!contact" :person="contact" />
        </div>

        <Divider w=".25" />

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
              <template v-if="job?.['FK|property_id']?.address">
                <Icon
                  v-if=" job?.job_name && job?.['FK|property_id']?.address"
                  inline-block text-xs mx2 my-auto
                  i-fa6-solid:house
                />
                <span>
                  {{ job?.['FK|property_id']?.address }}
                </span>
              </template>
            </div>

            <div self-start text-base ml-auto shrink-0>
              {{ job?.job_number }}
            </div>
          </div>
        </div>
      </div>
    </Card>
  </router-link>
</template>
