<script setup lang="ts">
const { client, data, loading, error } = storeToRefs(useMainStore())
const { query, getById } = useMainStore()

const result = $ref()

onMounted(() => {
  query()
})

const getMock = () => {
  query()
}

let test = $ref()
let test2 = $ref()

const go = () => {
  test = getById({ id: 3, type: 'workorders', getParsed: true })
  // console.log('id', test.client_id)
  test2 = getById({ id: test.client_id.id, type: 'clients' })
}

const changeData = () => {
  test.client_id.name = 'FUCK YOU'
}
</script>

<template>
  <div>
    <h1>Home</h1>
    <div class="border p-4 rounded bg-b-f">
      {{ test }}
    </div>
    <div class="border p-4 rounded bg-b-f">
      store value
      {{ test2 }}
      <!-- {{ data?.employees }} -->
    </div>
    <Button @click="getMock">
      Query
    </Button>
    <Button @click="go">
      Test
    </Button>
    <Button @click="changeData">
      change data
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
  </div>
</template>
