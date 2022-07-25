import { acceptHMRUpdate, defineStore } from 'pinia'
import type { MutationParams } from './mainStore'
import type { JobParsedType, WorkorderType } from '~/types'

export const useWoStore = defineStore('woStore', () => {
  const main = useMainStore()
  const router = useRouter()
  const state = reactive({
    saved: false,
    dirty: false,
    new: false,
  })
  const id = ref('')
  const wo = computed((): WorkorderType => main.getById({ id: id.value, type: 'workorders' }))
  const wo_number = computed(() => (main.getByType({ type: 'workorders' })?.length || 0) + 1700)
  let watcher

  function createWo(job: JobParsedType) {
    const newWo = { ...newWorkorder }
    newWo.id = useUid()
    newWo.wo_number = wo_number.value

    if (job) {
      newWo['FK|job_id'] = job.id
      newWo['FK|bid_id'] = job['FK|bid_id']?.id
      newWo['FK|client_id'] = job['FK|client_id'].id
      newWo['FK|contact_id'] = job['FK|contact_id']?.id
    }

    main.addItem({ data: newWo, table: 'workorders' })

    state.new = true
    loadWo(newWo.id)
    router.push({ name: 'workorders-id', params: { id: newWo.id } })
  }

  function saveWo() {
    try {
      state.saved = true
      mutation('workorders', 'update', wo.value, main.versions)
      state.dirty = false
    }
    catch (err) {
      getErrorMessage(err)
    }
  }

  function editWo() {
    state.saved = false
  }

  function trash() {
    let params: MutationParams = { data: wo.value, table: 'workorders' }

    if (state.new && !state.dirty)
      params = { ...params, localOnly: true }

    main.deleteById(params)
    close()
  }

  function loadWo(woId: string) {
    stop()

    state.saved = !state.new
    state.dirty = false
    id.value = woId

    getWatcher()
  }

  function safeToClose() {
    const trash = Boolean(state.new && !state.dirty)

    const close = Boolean(state.saved || (!state.new && !state.dirty))

    return { trash, close }
  }

  function close() {
    router.push({ path: '/' })
    state.saved = false
    state.dirty = false
    state.new = false
  }

  function getWatcher() {
    const stop = watch(wo.value, () => {
      state.dirty = true
    })

    watcher = stop
  }

  // cant have this watcher in pinia store
  watch(
    () => wo.value?.['FK|job_id'],
    () => {
      const job = main.getById({ id: wo.value['FK|job_id'], type: 'jobs' })

      if (job) {
        wo.value['FK|bid_id'] = job['FK|bid_id'] ?? wo.value['FK|bid_id']
        wo.value['FK|client_id'] = job['FK|client_id'] ?? wo.value['FK|client_id']
        wo.value['FK|contact_id'] = job['FK|contact_id'] ?? wo.value['FK|contact_id']
        wo.value['FK|property_id'] = job['FK|property_id'] ?? wo.value['FK|property_id']
      }
    })
  return { createWo, saveWo, loadWo, editWo, trash, wo, state, watcher, safeToClose, close }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useWoStore, import.meta.hot))

