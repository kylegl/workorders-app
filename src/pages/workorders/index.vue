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
      <div v-for="workorder in workorders" :key="workorder.id">
        <div class="flex gap-x-2 w-full bg-bg-a border border-bg-d rounded p-[.5rem] ">
          <div class="">
            {{ parseTimestampToDate(workorder.start_date) }}
          </div>
          <div class="">
            {{ workorder.id }}
          </div>
          <div class="">
            {{ workorder.status }}
          </div>
          <div class="">
            cli{{ getClientById(workorder.client_id)?.name }}
          </div>
          <div class="">
            {{ workorder.description }}
          </div>
          <div class="">
            emp{{ getEmployeeById(workorder.employee_id)?.name }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
