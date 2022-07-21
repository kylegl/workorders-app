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
        flex
        bg-1
        @click="editEmployee(employee.id)"
      >
        <div flex="~ col" w-38 gap2>
          <div>Name</div>
          <div text-h5>
            {{ employee.name }}
          </div>
        </div>
        <div flex="~ col" gap2 w-24>
          <div>Position</div>
          <div text-h5>
            {{ employee.position }}
          </div>
        </div>
        <div flex="~ col" gap=".5" justify-between w-40>
          <div>Phone</div>
          <div text-h5>
            {{ employee?.phone }}
          </div>
        </div>
        <div flex="~ col" gap=".5" justify-between w-50>
          <div>Email</div>
          <div text-h5>
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
