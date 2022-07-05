<script setup lang="ts">
import type { ParsedWorkorderType, WorkorderType } from '~/types'

const { loading, error } = storeToRefs(useMainStore())
const { getByType } = useMainStore()
const { createWo } = useWoStore()
const searchResults = $ref<WorkorderType[]>()

const rawWos = $computed(() => getByType({ type: 'workorders', getParsed: true }) ?? [])
const wos = $computed(() => searchResults?.length ? searchResults : rawWos)
const filteredWos = $ref<ParsedWorkorderType[]>()
const sortedWos = $ref<ParsedWorkorderType[]>()
</script>

<template>
  <div flex="~ col" gap8 w-full>
    <h1 text-h3>
      Work Orders
    </h1>
    <section flex="~ col" gap4 w-full>
      <div flex justify-between>
        <Search
          v-model:results="searchResults" :data="rawWos"
          :keys="woSearchKeys"
          w="1/2"
          min-w-xs
          max-w-75
        />

        <Button btn-primary @click="createWo">
          <Icon i-fa-solid:plus text-2xl />
          Work Order
        </Button>
      </div>

      <div flex gap2 items-center>
        <Icon i-mdi:filter text-2xl my-auto />
        <div flex gap2 w-full flex-wrap>
          <Filter v-model:filteredData="filteredWos" :filter-list="woFilters" :data="wos" flex gap2 />

          <Sort v-if="filteredWos" v-model:sortedList="sortedWos" :list="filteredWos" :keys="woSortKeys" flex gap2 />
        </div>
      </div>

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
          <Workorder v-for="wo in sortedWos" :key="wo?.id" :workorder="wo" />
        </div>
      </div>
    </section>
  </div>
</template>
