<script setup lang="ts">
import type { JobType } from '~/types'

const props = defineProps<{ id?: string; disabled: boolean }>()
const emit = defineEmits<{
  (e: 'update:id', value: string | undefined): void
}>()
const { getById, getByType } = useMainStore()

const id = useVModel(props, 'id', emit)
let job: JobType = $ref()

function onChange() {
  id.value = job?.id
}

function createJob(input: string) {
  const job = newJob()
  job.job_name = input

  return job
}

watchEffect(() => {
  if (props.id)
    job = getById({ id: props.id, type: 'jobs', getParsed: true })
})
const jobData = $computed(() => getByType({ type: 'jobs', getParsed: true }))
</script>

<template>
  <div>
    <label text-h5>Job</label>
    <SelectV2
      v-model:value="job"
      label="job_name"
      :data="jobData"
      :search-keys="['job_name', 'FK|client_id.name', 'FK|property_id.address', 'job_number']"
      :disabled="disabled" :taggable="true" :searchable="true"
      :create-option="createJob" table="jobs"
      bg-1
      text-norm
      border="~ base" rounded @deselected="onChange" @selected="onChange"
    >
      <template #option="{ option }">
        <div flex gap2>
          <div v-if="option['FK|client_id']?.name" font-bold>
            {{ option['FK|client_id']?.name }}
          </div>
          <div v-if="option.job_name">
            {{ option.job_name }}
          </div>
          <div v-if="option['FK|property_id']?.address" flex gap2 items-center>
            <Icon i-fa6-solid:house text-xs />
            {{ option['FK|property_id']?.address }}
          </div>
          <div v-if="option.job_number" flex gap2 items-center>
            <Icon i-material-symbols:numbers text-xs />
            {{ option.job_number }}
          </div>
        </div>
      </template>
    </SelectV2>
  </div>
</template>
