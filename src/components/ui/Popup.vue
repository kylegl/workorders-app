<script setup lang="ts">
const { show } = defineProps<{ show: boolean }>()
</script>

<template>
  <Teleport to="body">
    <div v-if="show">
      <Modal z-12>
        <slot />
      </Modal>
    </div>
  </Teleport>
</template>
