<script setup lang="ts">
import type { Employee, Workorder } from '~/types'
const { workorder } = defineProps<{ workorder: Workorder }>()
const { data } = storeToRefs(useMainStore())
const { getById } = useMainStore()
const startDate = $computed(() => {
  if (workorder?.start_date) return unixToHumanDate(workorder.start_date)
})
const dueDate = $computed(() => {
  if (workorder?.due_date) return unixToHumanDate(workorder.due_date)
})
const employee = $computed((): Employee => getById({ id: workorder['FK|employee_id'], type: 'employees' }))
</script>

<template>
  <router-link :to="{ name: 'workorders-id', params: { id: workorder.id } }" w-full>
    <Card>
      <div flex gap3>
        <div flex gap2 items-center text-sm>
          <div flex="~ col" gap2 justify-between>
            <StatusIndicator :status="workorder.status" />
            <div text-h5>
              #
            </div>
          </div>

          <div flex="~ col" gap2>
            <div flex gap2 items-center>
              <div>
                Start Date:
              </div>
              <div text-h5>
                {{ startDate }}
              </div>
            </div>
            <div flex gap2 items-center>
              <div>
                Due Date:
              </div>
              <div text-h5>
                {{ dueDate }}
              </div>
            </div>
          </div>
        </div>

        <div flex="~ col" gap2>
          <div>
            Assigned To
          </div>
          <div text-h5>
            {{ employee?.name }}
          </div>
        </div>
      </div>
    </Card>
  </router-link>
</template>
