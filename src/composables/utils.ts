import type { WatchWithFilterOptions } from '@vueuse/core'
import type { WatchCallback } from 'vue'
import { ReactiveVariable } from 'vue/macros'
import { newLineItem } from '~/composables/constants'
import type { ErrorWithMessage, Lineitem, TableKey } from '~/types'
import { lineitemValidator, workorderValidator } from '~/types'

export function isFK(key: string): TableKey | undefined {
  const [,,type] = key.match(/^(FK\|)([^_]+)_(id)$/) ?? []
  return type ? `${type}s` as TableKey : undefined
}

export function isDate(key: string) { /^([^_]+)_(date|at)$/.test(key) }

const isErrorWithMessage = (error: unknown): error is ErrorWithMessage => {
  return (
    typeof error === 'object'
    && error !== null
    && 'message' in error
    && typeof (error as Record<string, unknown>).message === 'string'
  )
}

const toErrorWithMessage = (maybeError: unknown): ErrorWithMessage => {
  if (isErrorWithMessage(maybeError)) return maybeError

  try {
    return new Error(JSON.stringify(maybeError))
  }
  catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError))
  }
}

export const getErrorMessage = (error: unknown) => {
  return toErrorWithMessage(error).message
}

export const createWorkorder = (job: Record<string, any>) => {
  const workorder = newWorkorder
  workorder.id = useUid()

  if (job) {
    workorder['FK|job_id'] = job.id
    workorder['FK|bid_id'] = job['FK|bid_id']?.id
    workorder['FK|client_id'] = job['FK|client_id']?.id
    workorder['FK|contact_id'] = job['FK|contact_id']?.id
  }

  return workorderValidator.parse(workorder)
}

export function createLineItem(workorderId: string, tasks: Array<Lineitem>) {
  const lineitem = newLineItem

  if (workorderId) {
    newLineItem.id = useUid()
    lineitem['FK|workorder_id'] = workorderId
    lineitem.item_number = tasks.length + 1
  }
  return lineitemValidator.parse(lineitem)
}

export function watchAfterInit(source: any, cb: WatchCallback, options: WatchWithFilterOptions<false> | undefined = {}) {
  const { ignoreUpdates } = watchIgnorable(
    source,
    cb,
    options,
  )

  ignoreUpdates(() => !source.value)
}

export function collectDirt(source, trash) {
  const makeDirty = () => trash.value = true

  watchAfterInit(source, makeDirty, { deep: true })
}
