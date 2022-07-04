<script setup>
const emit = defineEmits(['hover', 'click'])

const isHovered = boolean => emit('hover', boolean)

const handleClick = () => emit('click')
</script>

<template>
  <button
    flex items-center justify-center gap2 px="1" py="1" rounded text-h5 shadow-md min-w-fit
    class="group"
    hover="shadow-sm op100" in_out
    btn
    border="~ base 3"
    @click="handleClick"
    @mouseenter="isHovered(true)"
    @mouseleave="isHovered(false)"
  >
    <slot />
  </button>
</template>
