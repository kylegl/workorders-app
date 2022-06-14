<script setup lang="ts">
const { status } = defineProps<{ status: string }>()

const color = $computed(() => {
  switch (status) {
    case 'Upcoming':
      return 'bg-blue-500/80 shadow-blue-500/50'
    case 'Active':
      return 'bg-green-500/80 shadow-green-500/50'
    case 'Cancelled':
    case 'Hold':
      return 'bg-red-500/80 shadow-red-500/50'
    default:
      return 'bg-gray-500/80 shadow-gray-500/50'
  }
})
</script>

<template>
  <div
    flex p1 rounded-sm shadow-sm font-semibold tracking-wider text-fg-norm-d
    :class="color"
  >{{ status }}</div>
</template>
