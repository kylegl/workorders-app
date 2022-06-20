<script setup lang="ts">
import type { Job } from '~/types'
const { data, loading, error } = storeToRefs(useMainStore())
const { getByType, query } = useMainStore()
const route = useRoute()
const searchResults = $ref<Job[]>()
 
watch(() => route.params, () => {
  if (loading) setTimeout(() => query(), 1000)
}, { immediate: true })

const rawJobs = $computed((): Job[] => getByType({ type: 'jobs', getParsed: true }) ?? [])
const jobs = $computed(() => searchResults || rawJobs)
const filteredJobs = $ref([])
</script>

<template>
  <div flex="~ col" gap8 w-full>
    <h1 text-h3 op70>
      Jobs
    </h1>
    <section flex="~ col" gap4 w-full>
      <Search
        v-model:results="searchResults" :data="rawJobs"
        :keys="jobSearchKeys"
        w="1/2"
        max-w-75
      />

      <Filter v-model:filteredData="filteredJobs" :filter-list="jobFilters" :data="jobs" />
    </section>

    <section>
      <div v-if="loading">
        Loading Jobs ...
      </div>
      <div v-else-if="error">
        There was a problem getting the jobs...
      </div>
      <div v-else>
        <div v-if="jobs" flex="~ col" gap2>
          <Job v-for="job in filteredJobs" :key="job?.id" :job="job" />
        </div>
      </div>
    </section>
  </div>
</template>
