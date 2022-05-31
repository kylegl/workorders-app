<template>
    <div class="flex items-start w-full gap-x-8 text-lg bg-bg-a p-4">
      <router-link to="/home" class="text-fg-norm no-underline flex gap-x-2">
        <div class="i-fa-solid-home text-2xl" />Home
      </router-link>
      <router-link to="/workorders" class="text-fg-norm no-underline flex gap-x-2">
        <div class="i-bx-task text-2xl" />Work Orders
      </router-link>
      <router-link to="/directory" class="text-fg-norm no-underline flex gap-x-2">
        <div class="i-akar-icons-people-group text-2xl" /> Directory
      </router-link>
    </div>
</template>
