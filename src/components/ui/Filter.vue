<script setup lang="ts">
interface Filter {
  name: string
  key: string
  value: string | number
  isActive?: boolean
}

const { filterList, data } = defineProps<{
  filterList: Filter[]
  data: any[]
}>()

const emit = defineEmits(['update:filteredData'])

const filters = $ref(filterList.map(filter => ({ ...filter, isActive: false })))

const filteredData = $computed(() => {
  const activeFilters = filters.filter(filter => filter.isActive)

  if (activeFilters.length === 0) return data

  return data.filter((row) => {
    return activeFilters.some((filter) => {
      return row[filter.key] === filter.value
    })
  })
})

const toggleFilter = (filter: Filter) => filter.isActive = !filter.isActive

watchEffect(() => emit('update:filteredData', filteredData))

const isActive = (filter: Filter) => filter.isActive ? 'btn-active' : 'btn-primary'
</script>

<template>
  <div flex gap4>
    <Icon i-bx:filter-alt text-3xl my-auto text-fg-muted />
    <button
      v-for="filter in filters"
      :key="filter.name"
      border="~ base"
      btn
      :class="isActive(filter)"
      @click="toggleFilter(filter)"
    >
      {{ filter.name }}
    </button>
  </div>
</template>
