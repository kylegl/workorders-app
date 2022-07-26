<script setup lang="ts">
const toggleDark = useToggle(isDark)
</script>

<template>
  <button
    icon-btn
    i-carbon-sun dark:i-carbon-moon
    @click="toggleDark()"
  />
</template>
