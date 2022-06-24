<script setup lang="ts">
import { useWoStore } from '~/stores/wo/useWoStore'
const { wo, prevWo } = storeToRefs(useWoStore())
const data = $ref([{ id: 1, n: 'a' }, { id: 2, n: 'b' }])

const { setNewWo, setNewValue } = useWoStore()
const text = $ref('')
const count = $ref(0)

const go = () => {
  setNewWo()
}

const changeData = () => {
  console.log('update')
  setNewValue('FK|bid_id', +new Date())
}
</script>

<template>
  <div>
    <input v-model="text" type="text" bg-black>
    <button btn @click="go">
      New
    </button>
    <button btn @click="changeData">
      update
    </button>
    <div>
      <div>
        og ref:
        {{ data }}
      </div>
      <div>
        current:
        {{ wo }}
      </div>
      <div>
        prev:
        {{ prevWo }}
      </div>
    </div>
  </div>
</template>
