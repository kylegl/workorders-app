<script setup lang="ts">
import type { EmployeeType } from '~/types'
const props = defineProps<{ value?: Array<any>; disabled: boolean }>()
const emit = defineEmits<{
  (e: 'update:value', value: Array<any>): void
}>()
const { getById } = useMainStore()
const { data } = storeToRefs(useMainStore())

const value = useVModel(props, 'value', emit)
let employees: EmployeeType[] = $ref()

function onChange() {
  value.value = employees?.map(e => e.id)
}

function createEmployee(input: string) {
  const employee = { ...newEmployee }
  employee.id = useUid()
  employee.name = input

  return employee
}

watchEffect(() => {
  if (props.value)
    employees = props.value.map(id => getById({ id, type: 'employees' }))
})
</script>

<template>
  <div>
    <SelectV2
      v-model:value="employees"
      label="name"
      :data="data.employees" 
      :search-keys="['name']"
      :disabled="disabled" :multiple="true" :taggable="true" :push-tags="false"
      :create-option="createEmployee" table="employees"
      @deselected="onChange"
      @selected="onChange"
    />
  </div>
</template>
