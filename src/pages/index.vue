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
  const data = {
    tableName: 'workorders',
    data: {
      0: {
        'id': '9CXckZqXwkw8H8u5N6RLDg',
        'FK|job_id': '7a48e121-328b-4153-8b53-598fcc5b685c',
        'FK|bid_id': 'ee12b5ad-79af-4b92-88cd-76c94e5c6208',
        'FK|client_id': '88',
        'FK|contact_id': '70',
        'start_date': null,
        'due_date': null,
        'description': {
          ops: [
            {
              insert: 'Testing ',
            },
            {
              attributes: {
                list: 'ordered',
              },
              insert: '\n',
            },
            {
              insert: 'two',
            },
            {
              attributes: {
                list: 'ordered',
              },
              insert: '\n',
            },
            {
              insert: 'three',
            },
            {
              attributes: {
                list: 'ordered',
              },
              insert: '\n',
            },
          ],
        },
        'parking_info': '',
        'notes': '',
        'bill_type': '',
        'job_type': '',
        'created_at': 1655421663704,
        'updated_at': null,
        'closed_at': null,
        'status': '',
      },
    },
    clientVersions: {
      workorders: '50c0ac92-421e-46c8-9c7f-e3936d113c7a',
      line_items: '897a927f-aafc-442d-875c-bd0bb66f2e0e',
      contacts: '85cc21b6-24d4-4fc5-a076-14ede5bb4c94',
      employees: '7c94735c-6d94-4f9c-9cde-d9af9531b864',
      clients: 'fed9b534-eeac-417b-9100-460ebd5cb341',
      bids: 'bdae00bf-4157-4baa-b449-f2d1ee374ea2',
      jobs: '57ba6890-b397-4e92-9737-797b5eb79911',
    },
  }

  const stringifyDeltas = (entry) => {
    const keys = Object.keys(entry)

    const deltaKeys = ['description', 'notes', 'parking_info', 'details', 'quantity']

    return keys.reduce((result, key) => {
      if (deltaKeys.includes(key))
        result[key] = JSON.stringify(entry[key])
      else result[key] = entry[key]

      return result
    }, {})
  }

  test = stringifyDeltas(data[0])
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
    <!-- <div v-html="test" /> -->

    <div>{{ test }}</div>
  </div>
</template>

<style>

</style>
