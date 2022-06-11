<script setup lang="ts">
const { data, loading, error } = storeToRefs(useMainStore())
const { getByType } = useMainStore()

const filters = ['Job', 'Status', 'Team']
const searchValue = $ref('')

// TODO add suspense logic to await resutls. https://www.trpkovski.com/2021/09/25/suspense-feature-in-vue-3-with-sfc-script-setup/
const search = () => {
  // eslint-disable-next-line no-console
  console.log(searchValue)
}

const workorderTableHeaders: HeaderParam[] = [
  { key: 'status', title: 'Status' },
  { key: 'FK|client_id', displayProp: 'name', title: 'Client' },
  { key: 'FK|job_id', displayProp: 'address', title: 'Job' },
  { key: 'description', title: 'Description' },
  { key: 'FK|employee_id', displayProp: 'name', title: 'Assigned' },
  { key: 'start_date', title: 'Start Date' },
]

interface HeaderParam {
  key: string
  displayProp?: string | undefined
  title: string
}

const tableHeaders = $ref([])
const tableValues = $ref([])

onBeforeMount(() => {
  const data = getByType({ type: 'workorders', getParsed: true })
  if (data) {
    const values = data.map((row) => {
      const updatedRow = workorderTableHeaders.reduce((newRow, header) => {
        if (header?.displayProp) newRow[header.key] = row[header.key]?.[header.displayProp]
        else newRow[header.key] = row[header.key]
        return newRow
      }, {})

      updatedRow.id = row.id
      return updatedRow
    })
    workorderTableHeaders.forEach(header => tableHeaders.push(header))
    values.forEach(row => tableValues.push(row))
  }
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
            <button class="flex" @click="true">
              <Icon class="i-fluent-search-12-regular text-2xl in_out m-auto" hover="bg-fg-subtle" />
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
      <template v-if="tableValues.length">
        <Table
          :headers="tableHeaders"
          :values="tableValues"
          type="workorders"
        />
      </template>
    </section>
  </div>
</template>

<style>
.workorder-grid {
  grid-template-columns: 80px 100px 100px auto 75px 85px;
}
</style>
