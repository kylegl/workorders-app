<script setup lang="ts">
const { hasDates } = defineProps<{ hasDates: boolean }>()
</script>

<template>
  <div flex gap2 w-full items-center>
    <Icon i-ion:calendar-outline text-xl :class="{ 'text-red': !hasDates }" />
    <slot />
  </div>
</template>
