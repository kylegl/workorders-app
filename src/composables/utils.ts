import type { WatchWithFilterOptions } from '@vueuse/core'
import type { WatchCallback } from 'vue'
import * as short from 'short-uuid'
import type { ErrorWithMessage, TableKey, Version } from '~/types'
import { mutationValidator } from '~/types'
import { Mutation, Query } from '~/api/index'

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

export async function mutation(table: string, action: string, data?: TableRow, versions: Version) {
  const mutation = mutationValidator.parse({
    table,
    data,
  })

  const res = await Mutation(mutation, versions, action)
  return res
}

export const useUid = () => short.generate()

export function getStatusColor(status: string, startDate: number | null | undefined, employeeId: string | null | undefined) {
  const withinAWeek = tsWithin(startDate, -7)

  if (status === 'Upcoming' && withinAWeek && employeeId)
    status = 'warning'
  if (status === 'Upcoming' && withinAWeek && !employeeId)
    status = 'danger'

  return statusColors[status as keyof typeof statusColors]
}

