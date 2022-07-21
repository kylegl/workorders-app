<script setup lang="ts">
const { employee } = storeToRefs(useEmployeeStore())
const { saveEmployee, deleteEmployee } = useEmployeeStore()
const isDelete = $ref(false)
const isSave = $ref(false)

function deleteEmp() {
  useDelay(100, deleteEmployee, $$(isDelete))
}

function saveEmp() {
  useDelay(300, saveEmployee, $$(isSave))
}
</script>

<template>
  <div flex="~ col" gap4 w-full>
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
    <div flex gap2 justify-center>
      <Button
        bg-green
        @click="saveEmp"
      >
        <Icon i-carbon:save text-2xl :class="{ 'animate-tada animate-faster': isSave }"/>
        Save
      </Button>
      <Button bg-red  @click="deleteEmp">
        <Icon ref="target" i-carbon:trash-can text-2xl :class="{ 'rotate-140 transition-ease-in-out duration-100': isDelete }" />
        Delete
      </Button>
    </div>
  </div>
</template>
