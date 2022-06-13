<script setup lang="ts">
import type { LineItem } from '~/types'

const { data, idx } = defineProps<{
  data: LineItem
  idx: number
}>()

const toggleComplete = () => {
  data.completed = !data.completed
}

watchEffect(() => data.item_number = idx + 1)
</script>

<template>
  <div
    flex justify-between gap-x-2 h-auto min-h-20
    relative
  >
    <div flex="~ col">
      <div text-h5>
        {{ `#${data.item_number}` }}
      </div>
      <button
        m-auto text-xl in_out

        @click="toggleComplete"
      >
        <Icon v-if="!data.completed" i-carbon:checkbox text-2xl />
        <Icon v-if="data.completed" i-ci:check-bold text-green text-2xl />
      </button>
    </div>

    <div flex="~ col" w-96>
      <div text-h5>
        Description
      </div>
      <div>
        <div>
          {{ data.description }}
        </div>
      </div>
    </div>

    <div flex="~ col" w-24 max-w-48>
      <div text-h5>
        Details
      </div>
      <div>
        {{ data.details }}
      </div>
    </div>
    <div flex="~ col" w-12 max-w-24>
      <div text-h5>
        QTY
      </div>
      <div>
        {{ data.quantity }}
      </div>
    </div>
    <div flex="~ col" w-auto max-w-auto>
      <div text-h5>
        Notes
      </div>
      <div>
        {{ data.notes }}
      </div>
    </div>
    <div flex="~ col" w-12>
      <div text-h5>
        Hours
      </div>
      <div>
        {{ data.hours }}
      </div>
    </div>
  </div>
</template>
