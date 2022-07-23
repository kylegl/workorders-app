<script setup lang="ts">
const props = defineProps<{ id?: string; disabled: boolean }>()
const emit = defineEmits<{
  (e: 'update:id', value: string | undefined): void
}>()
const { data } = storeToRefs(useMainStore())

const propertyId = useVModel(props, 'id', emit)
</script>

<template>
  <div>
    <Datalist
      v-model="propertyId"
      type="properties"
      :list="data?.properties"
      :search-keys="['address']"
      :show-keys="['address']"
      class="z-1"
      label="Address"
      :disabled="disabled"
    />
  </div>
</template>
