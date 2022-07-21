<script setup lang="ts">
import { promiseTimeout } from '@vueuse/core'
import { print } from '~/composables/print'

const { wo, state } = storeToRefs(useWoStore())
const { saveWo, editWo, trash, safeToClose, close } = useWoStore()
const isDelete = $ref(false)
const isSave = $ref(false)
const printMe = $ref(false)
const togglePrint = useToggle($$(printMe))
const popupMsg = $ref('')

function deleteW() {
  useDelay(150, trash, $$(isDelete))
}

function saveW() {
  useDelay(300, saveWo, $$(isSave))
}

async function printPage() {
  togglePrint()
  await promiseTimeout(50)
  print('printMe', togglePrint)
}

const { isRevealed, reveal, confirm, cancel } = useConfirmDialog()

const openDialog = async () => {
  const { data, isCanceled } = await reveal()

  return { data, isCanceled }
}

async function checkWoState(action: string) {
  const isSafe = safeToClose()[action as keyof typeof safeToClose]
  let confirm = true

  if (!isSafe) {
    popupMsg = action === 'close'
      ? 'Do you want to save before leaving?'
      : 'Do you want to delete this work order?'

    const { isCanceled } = await openDialog()
    confirm = !isCanceled
  }

  if (confirm && action === 'close')
    saveW()

  if (confirm && action === 'trash')
    deleteW()

  close()
}
</script>

<template>
  <div flex="~ col" gap-y-4 relative>
    <Button btn-primary btn-icon place-self-end @click="checkWoState('close')">
      <Icon i-ri:arrow-go-back-fill text-2xl />
      Back
    </Button>
    <Popup :show="isRevealed">
      <div flex="~ col" gap4 items-center>
        <h3 text-h5>
          {{ popupMsg }}
        </h3>
        <div flex gap4>
          <Button bg-green w-18 @click="confirm">
            Yes
          </Button>
          <Button bg-red w-18 @click="cancel">
            No
          </Button>
        </div>
      </div>
    </Popup>
    <div flex justify-between>
      <h1 text-h3>
        {{ `Work Order #${wo.wo_number}` }}
      </h1>

      <div flex gap2>
        <Button btn-primary @click="printPage">
          <Icon i-ion:print text-2xl btn-icon />
          Print
        </Button>
        <Button v-if="state.saved" btn-primary @click="editWo(wo.id)">
          <Icon i-ion:edit text-2xl btn-icon />
          edit
        </Button>
        <Button
          v-else
          bg-green
          @click="saveW"
        >
          <Icon i-carbon:save text-2xl :class="{ 'animate-tada animate-faster': isSave }" />
          Save
        </Button>
        <Button bg-red @click="checkWoState('trash')">
          <Icon ref="target" i-carbon:trash-can text-2xl :class="{ 'rotate-140 transition-ease-in-out duration-100': isDelete }" />
          Delete
        </Button>
      </div>
    </div>

    <section v-if="!printMe" flex="~ col" gap-y-4>
      <WorkorderInfo />

      <Tasks />
    </section>
    <PrintPage v-else />
  </div>
</template>
