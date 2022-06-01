<script setup>
const { workorders, loading, error } = storeToRefs(useWorkorderStore())
const { displayValues, displayKeys } = useWorkorderStore()

const filters = ['Job', 'Status', 'Team']
const searchValue = ref('')

const search = () => {
  // eslint-disable-next-line no-console
  console.log(searchValue.value)
}

const workorderTableHeaders = [
  { key: 'start_date', title: 'Start Date' },
  { key: 'id', title: 'ID' },
  { key: 'status', title: 'Status' },
  { key: 'client', title: 'Client' },
  { key: 'description', title: 'Description' },
  { key: 'employee', title: 'Assigned' },
]

const tableValues = ({ headers, values }) => {
  return values.map(entry => Object.fromEntries(headers.reduce((row, header) => {
    row = [...row, [header.key, entry[header.key]]]
    return row
  }, [])))
}
const getTableValues = computed(() => {
  return tableValues({ headers: workorderTableHeaders, values: displayValues })
})
</script>

<template>
  <div class="flex flex-col gap-y-8 w-full">
    <h1 class="text-h3">
      Work Orders
    </h1>

    <section id="header" class="flex flex-col gap-y-4  w-full">
      <div class="flex justify-between w-full">
        <Input
          v-model="searchValue"
          type="text"
          class="w-1/2"
          place-holder-text="Search"
          @enter="search"
        >
          <template #after>
            <button class="flex" @click="search">
              <Icon class="i-fluent-search-12-regular text-2xl in_out" hover="bg-fg-subtle" />
            </button>
          </template>
        </Input>

        <Button class="text-h4 button-primary" @click="undefined">
          <Icon class="i-fa-solid:plus text-2xl" />
          Work Order
        </Button>
      </div>

      <!-- Filters -->
      <div class="flex gap-x-4">
        <Icon class="i-bx:filter-alt text-3xl m-0 my-auto text-fg-muted" />
        <Button v-for="filter in filters" :key="filter" class="button-primary">
          {{ filter }}
        </Button>
      </div>
    </section>

    <section class="flex flex-col gap-y-2">
      <div v-if="loading" class="">
        Loading Work Orders...
      </div>
      <div v-if="error" class="">
        {{ error }}
      </div>

      <template v-if="workorders">
        <Table
          :headers="workorderTableHeaders"
          :data="getTableValues"
          col-width="workorderTable"
          class="grid-cols-6"
        />
      </template>
    </section>
  </div>
</template>
