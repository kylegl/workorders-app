<script setup lang="ts">
const props = defineProps<{ id: string; disabled: boolean; saved: boolean }>()
const emit = defineEmits<{
  (e: 'update:id', value: string | undefined): void
  (e: 'update:isDirty', value: boolean): void
}>()
const { data, loading, error } = storeToRefs(useMainStore())
const isDirty = $ref(false)

const contactId = useVModel(props, 'id', emit)

watchEffect(() => emit('update:isDirty', isDirty))
</script>

<template>
  <div>
    <Datalist
      v-model="contactId"
      type="contacts"
      :list="data.contacts"
      :search-keys="['name']"
      :show-keys="['name']"
      class="z-1"
      label="Contact"
      :disabled="disabled"
    />
  </div>
</template>
