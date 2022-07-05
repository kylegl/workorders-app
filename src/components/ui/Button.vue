<script setup>
const emit = defineEmits(['hover', 'click'])

const isHovered = boolean => emit('hover', boolean)

const handleClick = () => emit('click')
</script>

<template>
  <button
    flex items-center justify-center gap2 px="1.5" py="1" rounded shadow-md min-w-fit text-h5
    class="group"
    hover="shadow-sm op100" in_out
    border-base
    @click="handleClick"
    @mouseenter="isHovered(true)"
    @mouseleave="isHovered(false)"
  >
    <slot />
  </button>
</template>
