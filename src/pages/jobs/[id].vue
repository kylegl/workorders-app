<script setup lang="ts">
const { id } = useRoute().params
const { data } = storeToRefs(useMainStore())
const { getByKeyValue, deleteById, addItem, getById } = useMainStore()

const job = $computed(() => getById({ id, type: 'jobs', getParsed: true }))
const workorders = $computed(() => getByKeyValue({ key: 'FK|job_id', value: id, type: 'workorders', getParsed: true }))
const jobTitle = $computed(() => {
  if (job?.job_name && job?.address) return `${job.job_name} - ${job.address}`
  return job?.job_name ?? job?.address
})
</script>

<template>
  <div flex="~ col" gap4 p8>
    <div flex gap4>
      <Card flex="~ col" gap2 w="1/2">
        <div text-h3 flex justify-between>
          {{ `Job #${job.job_number}` }}
        </div>
        <div text-h4>
          {{ job['FK|client_id'].name }}
        </div>
        <div text-h4>
          {{ jobTitle }}
        </div>
        <div flex="~ col" gap2>
          <div text-h5>
            {{ job['FK|contact_id']?.name }}
          </div>

          <div text-h5 flex gap2 items-center>
            <Icon i-carbon:email />
            {{ job['FK|contact_id']?.email }}
          </div>

          <div text-h5 flex items-center gap2>
            <Icon i-carbon:phone />
            {{ job['FK|contact_id']?.phone }}
          </div>
        </div>
      </Card>

      <div flex="~ col" gap2 w="1/2">
        <StatusIndicator :status="job.status" max-w-fit ml-auto />
        <div v-if="job.status === 'Upcoming' && job.start_date" flex text-base>
          Start Date:
          <div>
            {{ job.start_date }}
          </div>
        </div>
      </div>
    </div>

    <section v-if="workorders.length" flex="~ col" gap4>
      <div flex justify-between items-center>
        <div text-h4 >
          Workorders
        </div>
        <Button w-32 @click="true">
          <Icon i-fa-solid:plus text-2xl />
        </Button>
      </div>
      <div v-for="workorder in workorders" :key="workorder.id" >
        <Workorder :workorder="workorder" />
        <div absolute flex="~ col" left="-6" top-0 bottom-0 justify-center gap3>
          <router-link :to="{ name: 'workorders-id', params: { id: workorder.id } }">
            <button i-ion:edit icon-btn />
          </router-link>
          <button i-carbon:close icon-btn @click="deleteById({ id: workorder.id, type: 'workorders' })" />
        </div>
      </div>
    </section>
    <Button w-32 m-auto @click="true">
      <Icon i-fa-solid:plus text-2xl />
    </Button>
  </div>
</template>
