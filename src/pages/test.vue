<script setup lang="ts">
const { data, loading } = storeToRefs(useMainStore())
const initialValue = $ref(data?.value?.contacts?.[0])
</script>

<template>
  <div>
    <div v-if="loading">
      Loading...
    </div>
    <div v-else flex="~ col">
      {{ initialValue }}
      <SelectV2
        v-model:value="initialValue"
        :data="toRaw(data?.contacts) ?? []"
        :search-keys="['name']"
        label="name"
        :multiple="true"
        bg-1 text-norm
      />
    </div>
  </div>
</template>
