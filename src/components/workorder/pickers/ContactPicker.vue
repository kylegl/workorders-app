<script setup lang="ts">
const props = defineProps<{ id?: string | null; disabled: boolean }>()
const emit = defineEmits<{
  (e: 'update:id', value: string | undefined): void
}>()
const { data } = storeToRefs(useMainStore())

const contactId = useVModel(props, 'id', emit)
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
      label="Contacts"
      :disabled="disabled"
    />
  </div>
</template>

// TODO can have multiple contacts - need to account for this.
