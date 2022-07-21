<script setup lang="ts">
defineEmits(['back'])
</script>

<template>
  <Button place-self-end max-w-fit @click="$emit('back')">
    <Icon i-ri:arrow-go-back-fill text-2xl />
    Back
  </Button>
</template>
