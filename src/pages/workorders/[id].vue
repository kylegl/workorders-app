<script setup lang="ts">
import { useWoStore } from '~/stores/wo/woStore'

const { wo, state } = storeToRefs(useWoStore())
const { saveWo, editWo } = useWoStore()

// TODO Need to get this setup to update the db
// after this is setup. check update, delete, add, etc. Then pull line items from jobs and bids.
// after that setup print work order
// then setup auto sync between this and the db.
</script>

<template>
  <div flex="~ col" gap-y-4 p8 relative>
    <div flex justify-between>
      <h1 text-h3 :class="[state.dirty ? 'text-red/80' : '']">
        {{ `Work Order` }}
      </h1>
      <Button v-if="state.disabled" text-h5 @click="editWo">
        <Icon i-ion:edit text-2xl icon-btn />
        edit
      </Button>
      <Button v-else text-h5 @click="saveWo">
        <Icon i-carbon:save text-2xl icon-btn />
        Save
      </Button>
    </div>

    <WorkorderInfo />

    <Tasks :data="tasks" />
  </div>
</template>
