<script setup lang="ts">
const { loading } = storeToRefs(useMainStore())
const { query } = useMainStore()

if (process.env.NODE_ENV === 'production')
  query('database/get')

if (process.env.NODE_ENV === 'development') {
  onMounted(() => {
    if (loading) setTimeout(() => query('mock'), 1000)
  })
}
</script>

<template>
  <main
    font-sans
    text-norm
    bg-base
    flex="~ col"
    min-h-screen
  >
    <Nav
      fixed
      bottom-0
      w-full
      md="static"
    />
    <router-view
      class="w-full max-w-6xl mx-auto p-8"
    />
  </main>
</template>
