import { acceptHMRUpdate, defineStore } from 'pinia'

export const usePrintStore = defineStore('print', () => {
  const main = useMainStore()
  const { wo } = storeToRefs(useWoStore())

  const printValues = reactive({
    client: main.getById({ id: wo.value['FK|client_id'], type: 'clients' })?.name,
    contact: main.getById({ id: wo.value['FK|contact_id'], type: 'contacts' }),
    job: main.getById({ id: wo.value['FK|job_id'], type: 'jobs' }),
    employee: main.getById({ id: wo.value['FK|employee_id'], type: 'employees' }),
    startDate: computed(() => unixToHumanDate(wo.value?.start_date)),
    dueDate: computed(() => unixToHumanDate(wo.value?.due_date)),
    description: computed(() => wo.value.description),
    notes: computed(() => wo.value.notes),
    parkingInfo: computed(() => wo.value.parking_info),
    id: computed(() => wo.value.id),
  })

  return { printValues }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePrintStore, import.meta.hot))
