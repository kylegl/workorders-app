<script setup lang="ts">
const { data, loading } = storeToRefs(useMainStore())
const { parsedWo, wo } = storeToRefs(useWoStore())
const { loadWo } = useWoStore()

const load = () => {
  loadWo('0035cab8-d00e-4c89-bca8-c67efe9e699d')
}

const obj = $ref([
  { name: 'John', age: 30 },
  { name: 'Mary', age: 25 },
])

const localValue = $ref(parsedWo.value?.['FK|employee_id'])
</script>

<template>
  <div>
    <div v-if="loading">
      Loading...
    </div>
    <div v-else flex="~ col">
      <button @click="load">
        Load
      </button>
      {{ localValue }}
      <SelectV2
        v-model:value="obj"
        :data="toRaw(data?.employees) ?? []"
        :search-keys="['name']"
        label="name"
        :multiple="true" :taggable="true" :disabled="loading" :push-tags="true"
        bg-1 text-norm
      />
    </div>
  </div>
</template>
