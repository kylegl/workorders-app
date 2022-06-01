<script setup lang="ts">
interface Header {
  key: string
  title: string
}

interface Props {
  headers: Header[]
  data: []
}

const { headers, data } = defineProps<Props>()
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <div class="grid gap-x-4 gap-y-4 mb-8 border-b px-4">
      <div v-for="header in headers" :key="header.title">
        {{ header.title }}
      </div>
    </div>

    <div
      v-for="entry in data"
      :key="entry.id"
    >
      <router-link
        :to="{ name: 'workorders-id', params: { id: entry.id } }"
        class="grid gap-x-4 gap-y-4 border rounded bg-bg-c items-center px-4"
      >
        <div
          v-for="header in headers"
          :key="header.key + entry.id"
          class="gap-y-4"
        >
          {{
            entry[header.key]
          }}
        </div>
      </router-link>
    </div>
  </div>
</template>

<style>
.grid {
  grid-template-columns: 75px 30px 80px 100px auto 100px;
}
</style>
