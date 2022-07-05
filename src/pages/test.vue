<script setup lang="ts">

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

    <section w-full flex="~ col" bg-orange-300 p4>
      <div
        w-full min-h-25 rounded flex gap2
        bg-black
      >
        <div flex="~ col" w-50 bg-red shrink-0 />

        <div w=".25" bg-3 op30 />

        <div
          flex="~ col" overflow-hidden
          bg-blue
        >
          <div
            flex w-full gap4
            bg-green
            overflow-hidden
            no-wrap
          >
            <div min-w-fit wrap>
              Company erally long companmy name here
            </div>

            <div truncate min-w-0>
              <span>Job Name</span>
              <div inline-block i-carbon:home text-2xl />
              <span>Such preserved spaces take up space and do not hang, and thus affect the box's intrinsic sizes (min-content size and max-content size).</span>
            </div>
            <div shrink-0 ml-auto>
              # 1800
            </div>
          </div>

          <div
            w-full m-auto line-clamp-3
            bg-yellow-400
          >
            The line of text is a file name and a file extension. When that line truncates, it truncates just the name, always leaving the extension at the end. The trick is a flexbox parent so you can use overflow on just the file name part, but have to make sure to reset the min-width
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style>
.shrink2 {
  flex-shrink: 1;
}
.shrink5 {
  flex-shrink: .5;
}
</style>

