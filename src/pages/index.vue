<script setup lang="ts">
import type { ParsedWorkorderType, WorkorderType } from '~/types'

const { loading, error } = storeToRefs(useMainStore())
const { getByType, formatRowData } = useMainStore()
const { createWo } = useWoStore()
const searchResults = $ref<WorkorderType[]>()

const rawWos = $computed(() => getByType({ type: 'workorders', getParsed: true }) ?? [])
const wos = $computed(() => searchResults?.length ? searchResults : rawWos)
const filteredWos = $ref<ParsedWorkorderType[]>()
const sortedWos = $ref<ParsedWorkorderType[]>()

const wo = { 'id': '0035cab8-d00e-4c89-bca8-c67efe9e699d', 'wo_number': 1700, 'FK|client_id': '1de28a6d-445c-481f-881d-56d74e1575e1', 'FK|employee_id': ['c9a83eb2-0ba5-4b60-b31a-daae99e312c2', '0eec5a55-de7c-431c-88a5-f5a990c57e02', '077e4040-27a9-47c7-8020-209623914e70'], 'FK|contact_id': ['482d4243-f1ce-4a87-b14b-a6e9035f916b'], 'FK|job_id': 'c67225ac-b518-49a6-b5e9-a7c3c90299f8', 'FK|bid_id': 'f7bbb4d1-6df8-4426-85a6-724894fe9bbb', 'FK|property_id': '043e4db7-5630-4678-9e54-2e55edfbe09a', 'start_date': 1622557846000, 'due_date': 1643328783000, 'description': 'Vestibulum ac est lacinia nisi venenatis tristique.', 'notes': 'Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy.', 'bill_type': 'T&M', 'job_type': 'Finishing', 'created_at': 1641815024000, 'closed_at': 1649261207000, 'status': 'On-hold' }

const res = $ref()
function go() {
  console.log('hello')
  res = formatRowData({ row: wo })
}
</script>

<template>
  <div flex="~ col" gap8 w-full>
    <h1 text-h3>
      Work Orders
    </h1>
    {{ res }}
    <section flex="~ col" gap4 w-full>
      <div flex justify-between>
        <Search
          v-model:results="searchResults" :data="rawWos"
          :keys="woSearchKeys"
          w="1/2"
          min-w-xs
          max-w-75
        />
        <button @click="go()">
          click
        </button>

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
