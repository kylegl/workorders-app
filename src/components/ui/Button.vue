<script setup>
const emit = defineEmits(['hover', 'click'])

const isHovered = boolean => emit('hover', boolean)

const handleClick = () => emit('click')
</script>

<template>
  <button
    flex items-center justify-center gap2 p2
    border="~ base" rounded
    bg-bg-j dark:bg-bg-a
    text-h5
    shadow-md
    action-hover
    hover="shadow-sm"
    @click="handleClick"
    @mouseenter="isHovered(true)"
    @mouseleave="isHovered(false)"
  >
    <slot />
  </button>
</template>
