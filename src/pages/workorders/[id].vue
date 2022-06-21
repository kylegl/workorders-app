<script setup lang="ts">
const { data, loading, error } = storeToRefs(useMainStore())
const { getById, update } = useMainStore()
const route = useRoute()
const id = route.params?.id
let disabled = $ref(true)
let saved = $ref(false)
let taskDirt = $ref(false)
let infoDirt = $ref(false)
const isDirty = $computed(() => taskDirt || infoDirt)

const edit = () => {
  disabled = false
  saved = false
}

const save = () => {
  disabled = true
  saved = true
}

// TODO Need to get this setup to update the db
// after this is setup. check update, delete, add, etc. Then pull line items from jobs and bids.
// after that setup print work order
// then setup auto sync between this and the db.
const workorder = $computed(() => getById({ id, type: 'workorders' }))

const isClean = $ref(0)
const handleTaskDirt = (isDirt: boolean) => taskDirt = isDirt
const handleInfoDirt = (isDirt: boolean) => infoDirt = isDirt

watchEffect(() => {
  if (isClean)
    saved = false
})
</script>

<template>
  <div flex="~ col" gap-y-4 p8 relative>
    <div flex justify-between>
      <h1 text-h3 :class="[isDirty ? 'text-red/80' : '']">
        {{ `Work Order` }}
      </h1>
      <!--  -->
      <Button v-if="disabled" text-h5 @click="edit">
        <Icon i-ion:edit text-2xl icon-btn />
        edit
      </Button>
      <Button v-else text-h5 @click="save">
        <Icon i-carbon:save text-2xl icon-btn />
        Save
      </Button>
    </div>

    <WorkorderInfo v-model:workorder="workorder" :disabled="disabled" :saved="saved" @dirty="handleInfoDirt" />

    <Tasks :workorder-id="workorder?.id" :disabled="disabled" :saved="saved" @dirty="handleTaskDirt" />
  </div>
</template>
