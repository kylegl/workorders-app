<script setup lang="ts">
const { status, startDate, employee } = defineProps<{
  status: string
  startDate?: number
  employee?: string }>()

const statusColor = $computed(() => {
  let color
  switch (status) {
    case 'Upcoming':
      color = 'bg-blue-500/80 shadow-blue-500/50'
      break
    case 'In-progress':
    case 'Active':
      color = 'bg-green-500/80 shadow-green-500/50'
      break
    case 'Cancelled':
    case 'On-hold':
    case 'Hold':
      color = 'bg-red-500/80 shadow-red-500/50'
      break
    default:
      color = 'bg-gray-500/80 shadow-gray-500/50'
      break
  }
  return color
})

const color = $computed(() => {
  let color
  const withinAWeek = durationBoolean(startDate)

  if (withinAWeek) {
    color = 'bg-yellow-500/80 shadow-yellow-500/50'
    if (!employee)
      color = 'bg-orange-500/80 shadow-orange-500/50'
  }
  else { color = statusColor }

  return color
})
</script>

<template>
  <div
    flex p1 rounded-sm shadow-sm font-semibold tracking-wider text-fg-norm-d
    :class="color"
  >
    {{ status }}
  </div>
</template>
