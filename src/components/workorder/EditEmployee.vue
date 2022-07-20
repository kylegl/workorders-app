<script setup lang="ts">
const { employee } = storeToRefs(useEmployeeStore())
const { saveEmployee } = useEmployeeStore()
</script>

<template>
  <div flex="~ col" gap4 w-full dark:border-fg-drk-subtle>
    <div flex justify-between>
      <div text-h4>
        Edit Employee
      </div>
      <button i-carbon:close text-3xl font-extrabold icon-btn @click="saveEmployee" />
    </div>

    <div>
      <div text-h5>
        Name
      </div>
      <Input v-model="employee.name" />
    </div>

    <div>
      <Select v-model="employee.position" :list="employeePositions" label="Position" />

      <div>
        <div text-h5>
          Email
        </div>
        <Input v-model="employee.email" />
      </div>

      <div>
        <div text-h5>
          Phone
        </div>
        <Input v-model="employee.phone" />
      </div>
    </div>
    <Button m-auto hover="text-flip bg-green" @click="saveEmployee">
      <Icon i-fa-solid:plus text-2xl />
      Add
    </Button>
  </div>
</template>
