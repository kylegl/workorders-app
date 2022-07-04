<script setup>
const emit = defineEmits(['hover', 'click'])

const isHovered = boolean => emit('hover', boolean)

const handleClick = () => emit('click')
</script>

<template>
  <button
    flex items-center justify-center gap2 p2 rounded text-h5 shadow-md min-w-fit
    class="group"
    hover="shadow-sm op100" in_out
    btn
    @click="handleClick"
    @mouseenter="isHovered(true)"
    @mouseleave="isHovered(false)"
  >
    <slot />
  </button>
</template>
