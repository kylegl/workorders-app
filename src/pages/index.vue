<script setup lang="ts">
import '@vueup/vue-quill/dist/vue-quill.snow.css'
const { client, data, loading, error } = storeToRefs(useMainStore())
const { query, getById, getReadableDate } = useMainStore()

const { x, y } = useMouse()

onMounted(() => {
  query()
})

const getMock = () => {
  query()
}

const employee_id = $ref('0e124bdc-b3bc-4edb-85c8-6a1dbb73b562')

let A = $ref(1)

const B = $ref('')

let workorder = $ref()

const get = () => {
  const id = '9a249f4e-3289-46fa-9d56-2dadf92d4709'
  workorder = getById({ id, type: 'workorders' })
  A = workorder.start_date

  const dateToTimestamp = date => +new Date(date)

  useConvertSyncRefs($$(A), $$(B), unixToDate, dateToTimestamp)
}

const go = () => {
}

const changeData = () => {
}

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
]

const content = $ref('')
</script>

<template>
  <div>
    <h1>Home</h1>
    {{ x }}, {{ y }}
    {{ `id emitted: ${employee_id}` }}
    <div class="">
      B: {{ B }}
    </div>
    <div class="">
      A: {{ A }}
    </div>
    <div class="border p-4 rounded bg-b-f" />
    <div class="border p-4 rounded bg-b-f">
      store value
      <!-- {{ data?.employees }} -->
    </div>
    <Button @click="getMock">
      Query
    </Button>
    <Button @click="get">
      Get
    </Button>
    <Button @click="go">
      set A to B
    </Button>
    <Button @click="changeData">
      change B
    </Button>
    <div  v-html="content">
    </div>
    <div border rounded>
      <QuillEditor
        theme="snow"
        :toolbar="toolbarOptions"
        text-fg-normal
        bg-red
        v-model:content="content"
        contentType="html"
      />
    </div>
  </div>
</template>
