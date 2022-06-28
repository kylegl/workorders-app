import { acceptHMRUpdate, defineStore } from 'pinia'
import { newWorkorder } from '~/stores/wo/constants'
import type { JobParsedType, WorkorderType } from '~/types'

export const useWoStore = defineStore('woStore', () => {
  const main = useMainStore()
  const router = useRouter()
  const state = reactive({
    disabled: false,
    dirty: false,
  })
  const id = ref('')
  const wo = computed(() => main.getById({ id: id.value, type: 'workorders' }))
  let watcher

  function getWatcher() {
    const stop = watch(wo.value, () => {
      state.dirty = true
    })

    watcher = stop
  }

  function createWo(job: JobParsedType) {
    state.disabled = false
    const newWo = { ...newWorkorder }
    newWo.id = useUid()
    if (job) {
      newWo['FK|job_id'] = job.id
      newWo['FK|bid_id'] = job['FK|bid_id']?.id
      newWo['FK|client_id'] = job['FK|client_id'].id
      newWo['FK|contact_id'] = job['FK|contact_id']?.id
    }
    main.addItem({ data: newWo, table: 'workorders' })
    setId(newWo.id)
    const params = { id: newWo.id }
    router.push({ name: 'workorders-id', params })
  }

  function setId(woId: string) {
    state.disabled = false
    state.dirty = false

    id.value = woId
    getWatcher()
  }

  function saveWo() {
    try {
      state.disabled = true
      mutation('workorders', 'update', wo.value, main.versions)
      state.dirty = false
    }
    catch (err) {
      getErrorMessage(err)
    }
  }

  function editWo(id: string) {
    state.disabled = false
    loadWo(id)
  }

  function loadWo(woId: string) {
    stop()
    setId(woId)
  }
  return { createWo, saveWo, loadWo, editWo, wo, state, watcher }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useWoStore, import.meta.hot))

