<script setup lang="ts">
interface Header {
  key: string
  title: string
  type?: string
  callback?: string
  width: string
  align: string
}

interface Props {
  headers: Header[]
  data: []
  colWidth: string
}

const { headers, data, colWidth } = defineProps<Props>()

const outputValue = ({ type, value, callback }) => {
  if (!type) return value

  const types = {
    date: value => parseTimestampToDate(value),
    id: value => callback(value)?.name,
  }

  return types[type](value)
}

const numColumns = ref(headers.length)
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <div class="grid gap-x-4 gap-y-4 mb-8 border-b">
      <div v-for="header in headers" :key="header.title">
        {{ header.title }}
      </div>
    </div>

    <div
      v-for="entry in data"
      :key="entry.id"
      class="grid gap-x-4 gap-y-4 border rounded"
    >
      <div v-for="header in headers" :key="header + entry.id" class="gap-y-4">
        {{
          outputValue({
            type: header?.type,
            value: entry[header.key],
            callback: header?.callback,
          })
        }}
      </div>
    </div>
  </div>
</template>

<style>
.grid {
  grid-template-columns: 75px 30px 80px 100px auto 100px;
}
</style>
