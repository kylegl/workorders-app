<script setup lang="ts">
import type { LineItem } from '~/types'

interface Props {
  data?: LineItem
  disabled?: boolean
}

const { data, disabled = false } = defineProps<Props>()

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
    border="~ bg-d/20"
    p2
    rounded
    flex
    gap-x-2
  >
    <div flex="~ col">
      <div text-lg>
        Status
      </div>
      <button
        m-auto
        text-xl
        in_out
        hover="op80"
        @click="toggleComplete"
      >
        <Icon v-if="!tempdata.completed" i-carbon:checkbox />
        <Icon v-if="tempdata.completed" i-carbon:checkmark text-green />
      </button>
    </div>

    <div flex="~ col">
      <div text-lg>
        Description
      </div>
      <Input
        v-model="tempdata.description"
        place-holder-text="Description..."
        :disabled="disabled"
      />
    </div>

    <div flex="~ col">
      <div text-lg>
        Details
      </div>
      <Input
        v-model="tempdata.details"
        place-holder-text="Color, sheen ..."
        :disabled="disabled"
      />
    </div>
    <div flex="~ col" w-32>
      <div text-lg>
        QTY
      </div>
      <Input
        v-model="tempdata.quantity"
        place-holder-text="Color, sheen ..."
        :disabled="disabled"
      />
    </div>
    <div flex="~ col" w-18>
      <div text-lg>
        Hours
      </div>
      <Input
        v-model="tempdata.hours"
        :disabled="disabled"
        type="number"      />
    </div>
    <div flex="~ col">
      <div text-lg>
        Notes
      </div>
      <Input
        v-model="tempdata.notes"
        place-holder-text="Notes..."
        :disabled="disabled"
      />
    </div>
  </div>
</template>
