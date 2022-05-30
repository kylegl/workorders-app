<script setup>
const emit = defineEmits(['hover', 'click'])

const isHovered = boolean => emit('hover', boolean)

const handleClick = () => emit('click')
</script>

<template>
  <button
    class="flex items-center justify-center gap-x-[.5rem] rounded text-base p-[.5rem] shadow-md border border-fg-subtle"
    hover="shadow-sm  in_out"
    @click="handleClick"
    @mouseenter="isHovered(true)"
    @mouseleave="isHovered(false)"
  >
    <slot />
  </button>
</template>
