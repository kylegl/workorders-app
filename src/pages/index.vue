<script setup lang="ts">
const { client, data, loading, error } = storeToRefs(useMainStore())
const { query, getById, getReadableDate } = useMainStore()

const { x, y } = useMouse()

onMounted(() => {
  query()
})

const getMock = () => {
  query()
}

const employee_id = $ref('0e124bdc-b3bc-4edb-85c8-6a1dbb73b562')

let A = $ref(1)

let B = $ref('')

let workorder = $ref()

const get = () => {
  const id = '9a249f4e-3289-46fa-9d56-2dadf92d4709'
  workorder = getById({ id, type: 'workorders' })
  A = workorder.start_date

  const dateToTimestamp = date => +new Date(date)

  useConvertSyncRefs($$(A), $$(B), unixToDate, dateToTimestamp)
}

const go = () => {
}

const changeData = () => {
}
</script>

<template>
  <div>
    <h1>Home</h1>
    {{ x }}, {{ y }}
    {{ `id emitted: ${employee_id}` }}
    <div class="">
      B: {{ B }}
    </div>
    <div class="">
      A: {{ A }}
    </div>
    <div class="border p-4 rounded bg-b-f" />
    <div class="border p-4 rounded bg-b-f">
      store value
      <!-- {{ data?.employees }} -->
    </div>
    <Button @click="getMock">
      Query
    </Button>
    <Button @click="get">
      Get
    </Button>
    <Button @click="go">
      set A to B
    </Button>
    <Button @click="changeData">
      change B
    </Button>
    <div class="">
      {{ `loading ${loading}` }}
    </div>
    <div class="">
      {{ `error ${error}` }}
    </div>
    <h2>Employees</h2>
    <div class="">
      <!-- {{ data.employees }} -->
    </div>

    <h3>Versions</h3>
    <div class="">
      <!-- {{ client.versions }} -->
    </div>
  </div>
</template>
