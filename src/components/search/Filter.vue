<script setup lang="ts">
interface Filter {
  name: string
  key: string
  value: string | number
  isActive?: boolean
}

const { filterList, data, disabled } = defineProps<{
  filterList: Filter[]
  data: any[]
  disabled?: boolean
}>()

const emit = defineEmits(['update:filteredData'])

const filters = $ref(filterList)

const filteredData = $computed(() => {
  const activeFilters = filters.filter(filter => filter.isActive)

  if (activeFilters.length === 0)
    return data

  return data.filter((row) => {
    return activeFilters.some((filter) => {
      return row[filter.key] === filter.value
    })
  })
})

const toggleFilter = (filter: Filter) => filter.isActive = !filter.isActive

watchEffect(() => emit('update:filteredData', filteredData))

const isActive = (filter: Filter) => filter.isActive ? 'btn-active' : 'btn-inactive'
</script>

<template>
  <div>
    <Button
      v-for="filter in filters"
      :key="filter.name"
      :class="isActive(filter)"
      :disabled="disabled"
      @click="toggleFilter(filter)"
    >
      {{ filter.name }}
    </Button>
  </div>
</template>
