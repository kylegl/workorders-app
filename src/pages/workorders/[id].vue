<script setup lang="ts">
import { useWoStore } from '~/stores/wo/useWoStore'

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
        <Button v-if="state.disabled"  @click="editWo(wo.id)" btn-primary >
          <Icon i-ion:edit text-2xl btn-icon />
          edit
        </Button>
        <Button v-else @click="saveWo" btn-primary>
          <Icon i-carbon:save text-2xl btn-icon/>
          Save
        </Button>
        <Button  @click="printMe" btn-primary>
          <Icon i-ion:print text-2xl btn-icon />
          Print
        </Button>
      </div>
    </div>

    <section v-if="!printPage" id="printMe" flex="~ col" gap-y-4 >
      <WorkorderInfo />

      <Tasks />
    </section>
    <PrintPage v-else />
  </div>
</template>
