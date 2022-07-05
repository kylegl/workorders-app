<script setup lang="ts">
const { status, startDate, employee } = defineProps<{
  status: string
  startDate?: number
  employee?: string }>()

const statusColor = $computed(() => getStatusColor(status, startDate, employee))
</script>

<template>
  <div
    flex p1 rounded shadow-sm font-semibold tracking-wider text-fg-drk-norm justify-center
    :class="statusColor"
  >
    {{ status }}
  </div>
</template>
