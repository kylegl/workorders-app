<script setup>

</script>

<template>
    <div class="flex items-start w-full gap-x-8 text-lg bg-bg-a p-4">
      <router-link to="/workorders" class="text-fg-norm no-underline flex gap-x-2">
        <div class="i-fa-solid-home text-2xl" />Work Orders
      </router-link>
      <router-link to="/directory" class="text-fg-norm no-underline flex gap-x-2">
        <div class="i-akar-icons-people-group text-2xl" /> Directory
      </router-link>
      <router-link to="/jobs" class="text-fg-norm no-underline flex gap-x-2">
        <div class="i-akar-icons-people-group text-2xl" /> Jobs
      </router-link>
    </div>
</template>
