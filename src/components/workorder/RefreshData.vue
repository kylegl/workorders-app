<script setup lang="ts">
const { loading } = storeToRefs(useMainStore())
const { query } = useMainStore()
async function refreshData() {
  try {
    await query('database/getAll')
    return
  }
  catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <button
    icon-btn text-2xl i-tabler:refresh
    :class="{ 'animate-rotate animate-count-infinite': loading }"
    transition-ease-in-out duration-200
    @click="refreshData"
  />
</template>
