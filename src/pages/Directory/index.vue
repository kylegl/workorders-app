<script setup lang="ts">
const { data, loading, error } = storeToRefs(useMainStore())
const { getByType } = useMainStore()

const employees = computed(() => {
  const result = getByType({ type: 'workorders', getParsed: true })
  console.log('rest',result)
  return result
})
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <section class="flex flex-col gap-y-4">
      <div class="text-h4">
        Employees
      </div>
      {{employees}}
    </section>
  </div>
</template>
