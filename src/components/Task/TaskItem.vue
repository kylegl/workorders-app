<script setup lang="ts">
import type { LineItem } from '~/types'

const { data, idx } = defineProps<{
  data: LineItem
  idx: number
}>()

const toggleComplete = () => {
  data.completed = !data.completed
}

</script>

<template>
  <div
    rounded flex justify-between gap-x-2 p-2 h-auto min-h-20
    relative
    border="~ bg-d/20"
  >
    <div flex="~ col">
      <div text-h5>
        {{`#${data.item_number}`}}
      </div>
      <button
        m-auto text-xl in_out
        icon-btn
        @click="toggleComplete"
      >
        <Icon v-if="!data.completed" i-carbon:checkbox />
        <Icon v-if="data.completed" i-carbon:checkmark text-green />
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
