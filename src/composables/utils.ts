import type { WatchWithFilterOptions } from '@vueuse/core'
import { promiseTimeout } from '@vueuse/core'
import type { Ref, WatchCallback } from 'vue'
import { nanoid } from 'nanoid'
import type { Data, DataEntryType, DataTable, ErrorWithMessage, Id, StoreDataKey, Version } from '~/types'
import { mutationValidator } from '~/types'
import { Mutation } from '~/api/index'

export function isFK(key: string): { isForeignKey: boolean; name: StoreDataKey | undefined } {
  const [,,type] = key.match(/^(FK\|)([^_]+)_(id)$/) ?? []
  const name: StoreDataKey | undefined = type ? `${type}s` : undefined
  const isForeignKey = !!type

  return {
    isForeignKey,
    name,
  }
}

export function isDate(key: string): boolean { return /^([^_]+)_(date|at)$/.test(key) }

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

export function watchAfterInit(source: any, cb: WatchCallback, options: WatchWithFilterOptions<false> | undefined = {}) {
  const { ignoreUpdates } = watchIgnorable(
    source,
    cb,
    options,
  )

  ignoreUpdates(() => !source.value)
}

export function deRef(obj: any) {
  return Object.assign({}, obj)
}

export async function mutation(table: string, action: string, data: DataEntryType, versions: Version) {
  const mutation = mutationValidator.parse({
    table,
    data,
  })

  const res = await Mutation(mutation, versions, action)
  return res
}

export const useUid = () => nanoid()

export function getStatusColor(status: string, startDate: number | null | undefined, employeeId: string | null | undefined) {
  const withinAWeek = tsWithin(startDate, -7)

  if (status === 'Upcoming' && withinAWeek && employeeId)
    status = 'warning'
  if (status === 'Upcoming' && withinAWeek && !employeeId)
    status = 'danger'

  return statusColors[status as keyof typeof statusColors]
}

export async function useDelay(ms: number, cb: () => void, state?: Ref<boolean>) {
  if (state)
    state.value = !state.value

  await promiseTimeout(ms)

  if (state)
    state.value = !state.value

  return cb()
}

export function isJson(value: unknown) {
  try {
    JSON.parse(value)
    return true
  }
  catch(e) {
    console.log('isJson error', e)
    return false
  }
}
