<script setup>
const { workorders, loading, error } = storeToRefs(useWorkorderStore())
const { fetchWorkorders, getById } = useWorkorderStore()
const { clients } = storeToRefs(useClientStore())
const { employees } = storeToRefs(useEmployeeStore())
const { getClientById, fetchClients } = useClientStore()
const { getEmployeeById, fetchEmployees } = useEmployeeStore()

fetchClients()
fetchWorkorders()
fetchEmployees()

const filters = ['Job', 'Status', 'Team']
const searchValue = ref('')

const search = () => {
  console.log(searchValue.value)
  console.log(getClientById(33))
}

const workorderTableHeaders = [
  {
    key: 'start_date',
    title: 'Start Date',
    type: 'date',
    callback: '',
    width: '',
    align: 'start',
  },
  {
    key: 'id',
    title: 'ID',
    type: '',
    callback: '20px',
    width: '',
    align: 'start',
  },
  {
    key: 'status',
    title: 'Status',
    type: '',
    callback: '',
    width: '',
    align: 'start',
  },
  {
    key: 'client_id',
    title: 'Client',
    type: 'id',
    callback: getClientById,
    width: '1fr',
    align: 'start',
  },
  {
    key: 'description',
    title: 'Description',
    type: '',
    callback: '',
    width: '',
    align: 'start',
  },
  {
    key: 'employee_id',
    title: 'Assigned To',
    type: 'id',
    callback: getEmployeeById,
    width: '',
    align: 'start',
  },

]

// , 'ID', 'Status', 'Client', 'Description', 'Assigned']
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

        <Button class="text-h4 button-primary">
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

      <Table
        :headers="workorderTableHeaders"
        :data="workorders"
        col-width="workorderTable"
        class="grid-cols-6"
      />
    </section>
  </div>
</template>
