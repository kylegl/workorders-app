<script setup lang="ts">
import type { ClientType } from '~/types'

const props = defineProps<{ id?: string; disabled: boolean }>()
const emit = defineEmits<{
  (e: 'update:id', value: string | undefined): void
}>()
const { data } = storeToRefs(useMainStore())
const { getById } = useMainStore()

const id = useVModel(props, 'id', emit)
let client: ClientType = $ref()

function onChange() {
  id.value = client?.id
}

function createClient(input: string) {
  const client = newClient()
  client.name = input

  return client
}

watchEffect(() => {
  if (props.id)
    client = getById({ id: props.id, type: 'clients' })
})
</script>

<template>
  <div>
    <SelectV2
      v-model:value="client"
      label="name"
      :data="data.clients"
      :search-keys="['name']"
      :disabled="disabled" :taggable="true"
      :create-option="createClient" table="employees"
      bg-1
      text-norm
      border="~ base" rounded @deselected="onChange" @selected="onChange"
    />
  </div>
</template>
