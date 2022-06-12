<script setup lang="ts">
import type { LineItem } from '~/types'

const { data } = defineProps<{
  data: LineItem
}>()

const tempdata = $ref({
  id: 'b7b1cea5-e4db-49bf-8c22-cf13c7111fb7',
  workorder_id: '9a249f4e-3289-46fa-9d56-2dadf92d4709',
  description: 'sem praesent id massa id nisl venenatis lacinia aenean',
  details: 'diam',
  quantity: 16,
  hours: 24,
  notes: null,
  item_number: 259,
  completed: false,
})

const toggleComplete = () => {
  tempdata.completed = !tempdata.completed
}
</script>

<template>
  <div
    rounded flex justify-between  gap-x-2 p-2 h-auto min-h-20
    relative
    border="~ bg-d/20"
  >
    <div flex="~ col">
      <div text-h5>
        Status
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
