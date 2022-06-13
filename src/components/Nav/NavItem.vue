<script setup lang="ts">
const { to } = defineProps<{
  to: string
  title: string
  icon: string
}>()
</script>

<template>
  <router-link
    :to="to"
    no-underline flex gap-x-2 action-hover
    text-h5
  >
    <Icon :class="icon" text-2xl />{{ title }}
  </router-link>
</template>
