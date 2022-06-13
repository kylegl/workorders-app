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
      class="w-full max-w-7xl mx-auto p-8"
    />
  </main>
</template>
