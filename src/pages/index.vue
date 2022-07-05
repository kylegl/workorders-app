<script setup lang="ts">
import type { Job } from '~/types'
const { data, loading, error } = storeToRefs(useMainStore())
const { getByType } = useMainStore()
const searchResults = $ref<Job[]>()

const rawJobs = $computed((): Job[] => getByType({ type: 'jobs', getParsed: true }) ?? [])
const jobs = $computed(() => searchResults?.length ? searchResults : rawJobs)
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
        min-w-xs
        max-w-75
      />

      <div flex gap2 items-center>
        <Icon i-mdi:filter text-2xl my-auto />
        <div flex gap2 w-full flex-wrap>
          <Filter v-model:filteredData="filteredJobs" :filter-list="jobFilters" :data="jobs" flex gap2 />

          <Sort v-if="filteredJobs" v-model:sortedList="sortedJobs" :list="filteredJobs" :keys="jobSortKeys" flex gap2 />
        </div>
      </div>

      <Divider w="full" h=".25" />
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
