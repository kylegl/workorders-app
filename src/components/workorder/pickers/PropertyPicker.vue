<script setup lang="ts">
const props = defineProps<{ id?: string; disabled: boolean }>()
const emit = defineEmits<{
  (e: 'update:id', value: string | undefined): void
}>()
const { data } = storeToRefs(useMainStore())

const ID = useVModel(props, 'id', emit)
</script>

<template>
  <div>
    <Datalist
      v-model="ID"
      type="property"
      :list="data.property"
      :search-keys="['address']"
      :show-keys="['address']"
      class="z-1"
      label="Address"
      :disabled="disabled"
    />
  </div>
</template>
