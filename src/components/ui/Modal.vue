<script setup lang="ts">
const emit = defineEmits(['close'])

const modal = ref<HTMLDivElement | null>(null)

onClickOutside(modal, () => emit('close'))
</script>

<template>
  <div fixed top-0 bottom-0 left-0 right-0>
    <Card
      ref="modal"
      flex="~ col" items-center justify-center
      fixed left="50%" top="50%" translate-y="-50%" translate-x="-50%" m-auto
      min-w-100 h-auto w="1/2" z-11 p4
      bg-3
    >
      <slot />
    </Card>
  </div>
</template>
