<script setup lang="ts">
const { data, loading, error } = storeToRefs(useMainStore())
const { getByType } = useMainStore()

const employees = $computed(() => {
  const result = getByType({ type: 'employees' })
  return result
})
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <section class="flex flex-col gap-y-4">
      <div class="text-h4">
        Employees
      </div>
      <Card v-for="employee in employees" :key="employee.id" flex gap4 w-full>
        <div flex="~ col" w-38>
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
        <div flex="~ col" gap=".5" justify-between w-50>
          <div>Email</div>
          <div text-h5>
            {{ employee?.email }}
          </div>
          <div>Phone</div>
          <div text-h5>
            {{ employee?.phone }}
          </div>
        </div>
      </Card>
    </section>
  </div>
</template>
