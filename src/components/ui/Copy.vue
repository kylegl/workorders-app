<script setup lang="ts">
const { value } = defineProps<{ value: any }>()
const { copy, copied } = useClipboard()
</script>

<template>
  <div>
    <Icon v-if="!copied" i-carbon:copy icon-btn @click="copy(value)" />
    <Icon v-if="copied" i-ci:check-bold icon-btn />
  </div>
</template>
