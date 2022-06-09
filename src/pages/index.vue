<script setup lang="ts">
const { client, data, loading, error } = storeToRefs(useMainStore())
const { query, getById } = useMainStore()

const { x, y } = useMouse()

onMounted(() => {
  query()
})

const getMock = () => {
  query()
}
const textValue = $ref('')
const selectedId = $ref('0e124bdc-b3bc-4edb-85c8-6a1dbb73b562')
const employee_id = $ref('0e124bdc-b3bc-4edb-85c8-6a1dbb73b562')

const test = $ref()
const test2 = $ref()

const go = () => {

}

const changeData = () => {
}
</script>

<template>
  <div>
    <h1>Home</h1>
    {{x}}, {{y}}
    {{ `id emitted: ${employee_id}` }}
    <Datalist
      v-model="employee_id"
      :list="data.employees"
      :search-keys="['name', 'email']"
      type="employees"
      :show-keys="['name', 'position']"
    />

    <div class="border p-4 rounded bg-b-f" />
    <div class="border p-4 rounded bg-b-f">
      store value
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
      <!-- {{ data.employees }} -->
    </div>

    <h3>Versions</h3>
    <div class="">
      <!-- {{ client.versions }} -->
    </div>
  </div>
</template>
