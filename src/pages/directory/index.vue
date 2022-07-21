<script setup lang="ts">
const { data, loading, error } = storeToRefs(useMainStore())
const { getByType } = useMainStore()
const { state } = storeToRefs(useEmployeeStore())
const { addEmployee, saveEmployee, editEmployee } = useEmployeeStore()

const employees = $computed(() => {
  const result = getByType({ type: 'employees' })
  return result
})
</script>

<template>
  <div flex="~ col" gap4>
    <div flex justify-between>
      <div class="text-h3">
        Employees
      </div>
      <Button btn-primary @click="addEmployee">
        <Icon i-fa-solid:plus text-2xl />
        Employee
      </Button>
    </div>

    <Divider w-full h=".25" />
    <section flex="~ col" gap2>
      <Card
        v-for="employee in employees" :key="employee.id"
        flex="~ wrap" gap3
        bg-1
        @click="editEmployee(employee.id)"
      >
        <div text-h5 gap2 flex items-center shrink-0>
          <Icon i-lucide:hard-hat text-lg shrink-0 text-yellow />
          <div w-42>
            {{ employee.name }}
          </div>
          <Divider w=".25" shrink-0 h-full />
          <div>
            {{ employee.position }}
          </div>
        </div>
        <div flex text-h5 gap2 items-center w-40 shrink-0>
          <Icon i-carbon:phone shrink-0 />
          <div>
            {{ employee?.phone }}
          </div>
        </div>
        <div flex text-h5 gap2 grow shrink-0 items-center>
          <Icon i-carbon:email shrink-0 />
          <div>
            {{ employee?.email }}
          </div>
        </div>
      </Card>
    </section>
    <template v-if="state.showModal">
      <Modal @close="saveEmployee">
        <EditEmployee />
      </Modal>
    </template>
  </div>
</template>
