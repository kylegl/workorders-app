<script setup lang="ts">
const emit = defineEmits(['close'])

const modal = ref<HTMLDivElement>()
onClickOutside(modal, () => emit('close'))
</script>

<template>
  <div
    flex
    fixed right-0 left-0 top-0 bottom-0 m-auto
    items-center justify-center
    z-11
  >
    <Card
      ref="modal"
      m16 p4
      min-w-100
      border-base bg-2
      w="1/2"
    >
      <slot />
    </Card>
  </div>
</template>
