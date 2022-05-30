<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMainStore } from '~/stores/mainStore'
const { client, data, loading, error } = storeToRefs(useMainStore())
const { query } = useMainStore()

const result = reactive({ data: undefined })
onMounted(async () => {
  result.data = await query()
})

const getMock = async () => {
  result.data = await query()
}
</script>

<template>
  <h1>Home</h1>
  {{ `result ${result.data}` }}
  <Button @click="getMock">
    Query
  </Button>
  <div class="">
    {{ `loading ${loading}` }}
  </div>
  <div class="">
    {{ `error ${error}` }}
  </div>
  <h2>Employees</h2>
  <div class="">
    {{ data.employees }}
  </div>

  <h3>Versions</h3>
  <div class="">
    {{ client.versions }}
  </div>
</template>
