<script setup lang="ts">
import type { Header } from '~/types'
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
  <div flex="~ col" gap-y-4>
    <div grid gap4 mb8 border="b base" px4 :class="gridStyle">
      <div v-for="header in headers" :key="header.title" text-h5 action-hover>
        {{ header.title }}
      </div>
    </div>
    <Card
      v-for="row in values"
      :key="row.id"
    >
      <router-link
        :to="{ name: 'workorders-id', params: { id: row.id } }"
        grid gap4 items-center
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
    </Card>
  </div>
</template>

