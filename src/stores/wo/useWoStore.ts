import { acceptHMRUpdate, defineStore } from 'pinia'
import { newWorkorder } from '~/stores/wo/constants'
import type { JobParsedType, WorkorderType } from '~/types'

export const useWoStore = defineStore('woStore', () => {
  const main = useMainStore()
  const router = useRouter()
  const state = reactive({
    disabled: false,
    dirty: false,
    saved: false,
  })

  const wo = reactive({} as WorkorderType)

  function createWo(job: JobParsedType) {
    state.disabled = false
    Object.keys(newWorkorder).forEach(key => wo[key] = newWorkorder[key])

    wo.id = useUid()

    if (job) {
      wo['FK|job_id'] = job.id
      wo['FK|bid_id'] = job['FK|bid_id'].id
      wo['FK|client_id'] = job['FK|client_id'].id
      wo['FK|contact_id'] = job['FK|contact_id'].id
    }

    const params = { id: wo.id }
    router.push({ name: 'workorders-id', params })
  }

  function saveWo() {
    try {
      const isExisting = main.data.workorders?.find(entry => entry.id === wo.id)
      const deRefWo = deRef(wo)
      if (isExisting)
        Object.keys(deRefWo).forEach(key => isExisting[key] = deRefWo[key])

      if (!isExisting)
        main.addItem({ data: deRefWo, table: 'workorders' })

      console.log('save wo')
      state.disabled = true
      state.saved = true
      state.dirty = false
    }
    catch (err) {
      getErrorMessage(err)
    }
  }

  function editWo() {
    state.disabled = false
  }

  function loadWo(id: string) {
    const match = main.getById({ id, type: 'workorders' })
    if (match) {
      const unref = deRef(match)
      Object.keys(unref).forEach(key => wo[key] = unref[key])
    }
  }
  return { createWo, saveWo, loadWo, editWo, wo, state }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useWoStore, import.meta.hot))

