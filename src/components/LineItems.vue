<script setup lang="ts">
const { workorderId } = defineProps<Props>()
const { data, loading, error } = storeToRefs(useMainStore())
const { getByKeyValue } = useMainStore()

interface Props {
  workorderId: string
}
const existingLineItems = getByKeyValue({ key: 'workorder_id', value: workorderId, type: 'lineItems' })

const lineItems = $ref(existingLineItems)
const headers = [
  { key: 'completed', title: 'Status' },
  { key: 'description', title: 'Description' },
  { key: 'details', title: 'Info' },
  { key: 'quantity', title: 'Qty' },
  { key: 'notes', title: 'Notes' },
  { key: 'hours', title: 'Hrs' },
]
const addLineItem = () => {
  console.log('add line item')
}
</script>

<template>
  <div class="flex flex-col gap-y-4 border rounded p-4 w-full">
    <Button class="w-32 m-auto" @click="addLineItem">
      <Icon class="i-fa-solid:plus text-2xl" />
    </Button>

    <!-- EXISTING LINE ITEMS -->
    <section v-if="lineItems?.length">
      <div>
        <ul class="flex flex-col gap-y-2">
          <!-- LINE ITEM -->
          <!-- <li
            v-for="row in lineItems"
            :key="row.id"
            class="flex flex-col"
          > -->
          <li>
            <LineItem />
            <!-- HEADERS -->
            <!-- <div class="bg-bg-c grid">
              <div v-for="header in headers" :key="header.title + row.id" class="">
                {{ header.title }}
              </div>
            </div> -->
            <!-- VALUES -->
            <!-- <div class="bg-bg-a grid">
              <div v-for="header in headers" :key="header.key + row.id" class="flex flex-col">
                {{ row[header.key] }}
              </div>
            </div> -->
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.grid {
  grid-template-columns: 80px 100px 100px auto 75px 85px;
}
</style>
