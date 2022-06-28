<script setup lang="ts">
import { mainModule } from 'process'
import { useTaskStore } from '~/stores/tasks/useTaskStore'
import { useWoStore } from '~/stores/wo/useWoStore'
const { wo, prevWo } = storeToRefs(useWoStore())
const { task, id } = storeToRefs(useTaskStore())
const { loadTask } = useTaskStore()
const { data } = storeToRefs(useMainStore())
const { getById, update } = useMainStore()

const data1 = $ref([{ id: 1, n: 'a' }, { id: 2, n: 'b' }])

// const { setNewWo, setNewValue } = useWoStore()
const text = $ref('')
const count = $ref(0)

const go = () => {
  console.time('go')
  loadTask('beb6ddd5-f272-41df-b72c-1cfa21f422eb')
  console.timeEnd('go')
}

const changeData = () => {
  loadTask('12d1c1cf-dcf2-4901-8e16-ad9a7a4061d5')
}

const changeLineItem = () => {
  const task = getById({ id: 'beb6ddd5-f272-41df-b72c-1cfa21f422eb', type: 'line_items' })
  console.log('ttask', task)
  task.completed = true
}
</script>

<template>
  <div>
    <input v-model="text" type="text" bg-black>
    <button btn @click="go">
      Go
    </button>
    <button btn @click="changeData">
      Change Data
    </button>
    <button btn @click="changeLineItem">
      Change Line item
    </button>
    <div>
      <div>
        og ref:
        <!-- {{ data }} -->
      </div>
      <div>
        current:
        {{ task }}
      </div>
      <div>
        prev:
        {{ id }}
      </div>
    </div>
  </div>
</template>
