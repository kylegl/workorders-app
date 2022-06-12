<script setup lang="ts">
const { client, data, loading, error } = storeToRefs(useMainStore())
const { query, getById, getReadableDate, getByType } = useMainStore()

const { x, y } = useMouse()

onMounted(() => {
  // setTimeout(() => query(), 1000)
})

const getMock = () => {
  query()
}

const get = () => {
  console.log(getById({id: '1', type: 'workorders' }))
}

const delta = $ref('')
let html = $ref('')

const go = () => {
  console.log(delta)
  html = parseDelta(delta)
}

const changeData = () => {
}

const initialDelta = { ops: [{ insert: 'list' }, { attributes: { list: 'ordered' }, insert: '\n' }, { insert: 'sdff' }, { attributes: { list: 'ordered' }, insert: '\n' }, { insert: 'adffee' }, { attributes: { list: 'ordered' }, insert: '\n\n' }] }
</script>

<template>
  <div>
    <h1>Home</h1>
    {{ x }}, {{ y }}
    <div flex="~ col" gap-y-4>
      <div flex gap-x-4>
        <Button @click="getMock">
          Query
        </Button>
        <Button @click="get">
          Get
        </Button>
        <Button @click="go">
          Go
        </Button>
        <Button @click="changeData">
          change Data
        </Button>
      </div>

      <div>
        <Editor v-model:content="delta" :data="initialDelta" />
      </div>
    </div>
    <div v-if="html" v-html="html" />

    <div />
  </div>
</template>

<style>

</style>
