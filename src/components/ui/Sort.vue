<script setup lang="ts">
import type { SortKey, SortKeyArray } from '~/types'
const { keys, list } = defineProps<{
  keys: SortKeyArray
  list: any[]
}>()
const emit = defineEmits(['update:sortedList'])

const sortKeys = $ref(keys)
const activeKey = $computed(() => sortKeys.find(key => key.isActive))

const toggleSort = (key: SortKey) => {
  if (activeKey && activeKey.name !== key.name)
    activeKey.isActive = false

  if (key.isActive)
    key.isReverse = !key.isReverse

  if (!key.isActive)
    key.isActive = true
}

const sortedList = $computed(() => {
  if (!activeKey)
    return list
  const keys = activeKey.key.split('.')
  const sorted = [...list].sort((a, b) => {
    const aVal = keys.reduce((val, key) => val[key], a)
    const bVal = keys.reduce((val, key) => val[key], b)

    return activeKey.isString ? aVal.localeCompare(bVal) : aVal - bVal
  })

  return activeKey.isReverse ? sorted.reverse() : sorted
})

watchEffect(() => emit('update:sortedList', sortedList))
const active = (key: SortKey) => key.isActive ? 'btn-active' : 'btn-inactive'
</script>

<template>
  <div>
    <button
      v-for="key in sortKeys" :key="key.name"
      btn flex gap1
      :class="active(key)"
      @click="toggleSort(key)"
    >
      {{ key.name }}
      <Icon i-carbon:arrows-vertical text-xl my-auto text-fg-muted />
    </button>
  </div>
</template>
