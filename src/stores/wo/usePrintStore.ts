import { acceptHMRUpdate, defineStore } from 'pinia'
import { useWoStore } from '~/stores/wo/useWoStore'

export const usePrintStore = defineStore('print', () => {
  const main = useMainStore()
  const { wo } = useWoStore()

  const printValues = reactive({
    client: main.getById({ id: wo['FK|client_id'], type: 'clients' })?.name,
    contact: main.getById({ id: wo['FK|contact_id'], type: 'contacts' }),
    job: main.getById({ id: wo['FK|job_id'], type: 'jobs' }),
    startDate: computed(() => unixToHumanDate(wo.start_date)),
    dueDate: computed(() => unixToHumanDate(wo.due_date)),
    description: computed(() => wo.description),
    notes: computed(() => wo.notes),
    parkingInfo: computed(() => wo.parking_info),
    tasks: main.getByKeyValue({ key: 'FK|workorder_id', value: wo.id, type: 'line_items' }),
  })

  return { printValues }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePrintStore, import.meta.hot))
