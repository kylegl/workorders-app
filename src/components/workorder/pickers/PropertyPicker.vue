<script setup lang="ts">
import type { PropertyType } from '~/types'

const props = defineProps<{ id?: string; disabled: boolean }>()
const emit = defineEmits<{
  (e: 'update:id', value: string | undefined): void
}>()
const { data } = storeToRefs(useMainStore())
const { getById } = useMainStore()

const id = useVModel(props, 'id', emit)
let property: PropertyType = $ref()

function onChange() {
  id.value = property?.id
}

function createProperty(input: string) {
  const property = newProperty()
  property.address = input

  return property
}

watchEffect(() => {
  if (props.id)
    property = getById({ id: props.id, type: 'properties' })
})
</script>

<template>
  <div>
    <label text-h5>Address</label>
    <SelectV2
      v-model:value="property"
      label="address"
      :data="data.properties"
      :search-keys="['address']"
      :disabled="disabled" :taggable="true" :searchable="true"
      :create-option="createProperty" table="properties"
      bg-1
      text-norm
      border="~ base" rounded @deselected="onChange" @selected="onChange"
    />
  </div>
</template>
