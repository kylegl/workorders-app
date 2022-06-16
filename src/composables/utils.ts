import type { DataTableName, ErrorWithMessage } from '~/api/apiResponseTypes'

export function isFK(key: string): DataTableName | undefined {
  const [,,type] = key.match(/^(FK\|)([^_]+)_(id)$/) ?? []
  return type ? `${type}s` as DataTableName : undefined
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
  if (job) {
    workorder['FK|job_id'] = job.id
    workorder['FK|bid_id'] = job['FK|bid_id']?.id
    workorder['FK|client_id'] = job['FK|client_id']?.id
    workorder['FK|contact_id'] = job['FK|contact_id']?.id
  }

  return workorder
}
export function watchAfterInit(source: any, cb: Function, options: WatchWithFilterOptions<false> | undefined = {}) {
  const { ignoreUpdates } = watchIgnorable(
    source,
    cb,
    options,
  )

  ignoreUpdates(() => !source.value)
}

