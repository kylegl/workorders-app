<script setup lang="ts">
import type { SortKey, SortKeyArray } from '~/types'
const { keys, list, disabled } = defineProps<{
  keys: SortKeyArray
  list: any[] | undefined
  disabled?: boolean
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
  if (!activeKey || !list)
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
    <Button
      v-for="key in sortKeys" :key="key.name"
      flex gap1
      :class="active(key)"
      @click="toggleSort(key)"
      :disabled="disabled"
    >
      {{ key.name }}
      <Icon v-if="!key.isString"
        i-carbon:arrow-down text-xl my-auto text-fg-muted in_out
        :class="{ 'rotate-180': key.isReverse, 'rotate-0': !key.isReverse }"
      />
      <Icon v-if="key.isString"
        text-xl my-auto text-fg-muted in_out
        :class="{ 'i-icons8:alphabetical-sorting-2 rotate-360': key.isReverse, 'i-icons8:alphabetical-sorting  rotate-0': !key.isReverse }"
      />
    </Button>
  </div>
</template>
