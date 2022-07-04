<script setup lang="ts">
const { wo, state } = storeToRefs(useWoStore())
const { saveWo, editWo } = useWoStore()
let printPage = $ref(false)
const printMe = () => {
  printPage = true

  setTimeout(() => {
    print('printMe')
    printPage = false
  }, 1000)
}
</script>

<template>
  <div flex="~ col" gap-y-4 relative>
    <div flex justify-between>
      <h1 text-h3>
        {{ `Work Order #${wo.wo_number}` }}
      </h1>

      <div flex gap4>
        <Button v-if="state.disabled" btn-primary @click="editWo(wo.id)">
          <Icon i-ion:edit text-2xl btn-icon />
          edit
        </Button>
        <Button v-else btn-primary @click="saveWo">
          <Icon i-carbon:save text-2xl btn-icon />
          Save
        </Button>
        <Button btn-primary @click="printMe">
          <Icon i-ion:print text-2xl btn-icon />
          Print
        </Button>
      </div>
    </div>

    <section v-if="!printPage" id="printMe" flex="~ col" gap-y-4>
      <WorkorderInfo />

      <Tasks />
    </section>
    <PrintPage v-else />
  </div>
</template>
