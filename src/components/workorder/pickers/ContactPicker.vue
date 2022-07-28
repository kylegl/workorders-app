<script setup lang="ts">
import type { ContactType } from '~/types'
const props = defineProps<{ value?: Array<any>; disabled: boolean; clientId?: string }>()
const emit = defineEmits<{
  (e: 'update:value', value: Array<any>): void
}>()
const { getById } = useMainStore()
const { data } = storeToRefs(useMainStore())

const value = useVModel(props, 'value', emit)
let contacts: ContactType[] = $ref()

function onChange() {
  value.value = contacts?.map(e => e.id)
}

function createContact(input: string) {
  const employee = newContact()
  employee.name = input
  employee['FK|client_id'] = props.clientId

  return employee
}

watchEffect(() => {
  if (props.value)
    contacts = props.value.map(id => getById({ id, type: 'contacts' }))
})
</script>

<template>
  <div>
    <label text-h5>Contact</label>
    <SelectV2
      v-model:value="contacts"
      label="name"
      :data="data.contacts"
      :search-keys="['name']"
      :disabled="disabled" :multiple="true" :taggable="true" :push-tags="false"
      :create-option="createContact" table="contacts"
      bg-1
      text-norm
      border="~ base" rounded @deselected="onChange" @selected="onChange"
    />
  </div>
</template>
