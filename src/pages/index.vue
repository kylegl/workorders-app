<script setup lang="ts">
const { client, data, loading, error } = storeToRefs(useMainStore())
const { query, getById } = useMainStore()

const result = reactive({ data: undefined })

onMounted(() => {
  result.data = query()
})

const getMock = () => {
  result.data = query()
}

const test = reactive({})
const test2 = ref({})

const go = () => {
  test.value = getById({ id: 1, type: 'jobs', getParsed: true })
  test2.value = data.value.clients.find(clients => clients.id === test.value.data.client_id)
}

const changeData = () => {

  test.value.displayValues.client_id.name = "FUCK YOU"
}
</script>

<template>
  <div>
    <h1>Home</h1>
    {{ 'getter response' }}
    {{ test }}
    <div class="border p-4 rounded bg-b-f">
      store value
      {{ test2 }}
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
