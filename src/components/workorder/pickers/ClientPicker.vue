<script setup lang="ts">
const props = defineProps<{ id?: string; disabled: boolean }>()
const emit = defineEmits<{
  (e: 'update:id', value: string | undefined): void
}>()
const { data } = storeToRefs(useMainStore())

const clientId = useVModel(props, 'id', emit)
</script>

<template>
  <div>
    <Datalist
      v-model="clientId"
      label="Client"
      type="clients"
      :list="data.clients"
      :search-keys="['name']"
      :show-keys="['name']"
      :disabled="disabled"
    />
  </div>
</template>
