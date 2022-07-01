<script setup lang="ts">
import type { ParsedWorkorderType, WorkorderType } from '~/types'

const { data, loading, error } = storeToRefs(useMainStore())
const { getByType } = useMainStore()
const searchResults = $ref<WorkorderType[]>()

const rawWos = $computed(() => getByType({ type: 'workorders', getParsed: true }) ?? [])
const wos = $computed(() => searchResults?.length ? searchResults : rawWos)
const filteredWos = $ref<ParsedWorkorderType[]>()
</script>

<template>
  <div flex="~ col" gap8 w-full>
    <h1 text-h3 op70>
      Work Orders
    </h1>
    <section flex="~ col" gap4 w-full>
      <Search
        v-model:results="searchResults" :data="rawWos"
        :keys="woSearchKeys"
        w="1/2"
        max-w-75
      />

      <Filter v-model:filteredData="filteredWos" :filter-list="woFilters" :data="wos" />
      <Divider w="full" h=".25" />
    </section>

    <section>
      <div v-if="loading">
        Loading Work Orders ...
      </div>
      <div v-else-if="error">
        There was a problem getting the Work Orders...
      </div>
      <div v-else>
        <div v-if="wos" flex="~ col" gap2>
          <Workorder v-for="wo in filteredWos" :key="wo?.id" :workorder="wo" />
        </div>
      </div>
    </section>
  </div>
</template>

