<script setup lang="ts">
const { client, data, loading, error } = storeToRefs(useMainStore())
const { query, getById, getReadableDate, getByType, watchState } = useMainStore()

const { x, y } = useMouse()

onMounted(() => {
  // setTimeout(() => query(), 1000)
})
let test = $ref()

const getMock = () => {
  test = query()
}

const get = () => {

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
        <Button @click="false">
          Parse
        </Button>
        <Button @click="changeData">
          change Data
        </Button>
      </div>

      <div>
        <Editor v-model:content="delta" :data="initialDelta" />
      </div>
    </div>
    <!-- <div v-html="test" /> -->

    <div>{{ test }}</div>
  </div>
</template>

<style>

</style>
