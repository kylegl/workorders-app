<script setup lang="ts">
interface Header {
  key: string
  title: string
}
interface Props {
  headers: Header[]
  values: any[]
  type: string
}

const { headers, values, type } = defineProps<Props>()

const gridStyle = computed(() => {
  const options = {
    workorders: 'workorder-grid',
    lineItems: 'lineitem-grid',
  }

  return options[type]
})
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <div class=" grid gap-x-4 gap-y-4 mb-8 border-b px-4" :class="gridStyle">
      <div v-for="header in headers" :key="header.title">
        {{ header.title }}
      </div>
    </div>

    <div
      v-for="row in values"
      :key="row.id"
    >
      <router-link
        :to="{ name: 'workorders-id', params: { id: row.id } }"
        class="grid gap-x-4 gap-y-4 border rounded bg-bg-c items-center px-4"
        :class="gridStyle"
      >
        <div
          v-for="header in headers"
          :key="header.title + row.id"
          class="gap-y-4 line-clamp-3"
        >
          {{
            row[header.key]
          }}
        </div>
      </router-link>
    </div>
  </div>
</template>

<style>

</style>
