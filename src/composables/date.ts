import { Temporal } from '@js-temporal/polyfill'

export const unixToHumanDate = (timestamp: number): Date | string => {
  if (!timestamp) return ''
  const instant = Temporal.Instant
    .fromEpochMilliseconds(timestamp)
    .toZonedDateTimeISO('America/Los_Angeles')
    .toPlainDate()

  return `${instant.month}/${instant.day}/${instant.year}`
}

export const unixToDate = (timestamp: number): Date | string => {
  if (!timestamp) return ''
  const instant = Temporal.Instant
    .fromEpochMilliseconds(timestamp)
    .toZonedDateTimeISO('America/Los_Angeles')
    .toPlainDate()

  const month = (instant.month).toString().length === 1 ? `0${instant.month}` : instant.month
  const day = (instant.day).toString().length === 1 ? `0${instant.day}` : instant.day

  return `${instant.year}-${month}-${day}`
}

export const dateToUnix = (date: Date | string): Date | number | undefined => +new Date(date)

export const tsWithin = (timestamp: number | null | undefined, days: number): boolean => {
  if (!timestamp) return false
  const start = Temporal.Instant
    .fromEpochMilliseconds(timestamp)
    .toZonedDateTimeISO('America/Los_Angeles')
    .toPlainDate()

  const now = Temporal.Instant
    .fromEpochMilliseconds(+new Date())
    .toZonedDateTimeISO('America/Los_Angeles')
    .toPlainDate()

  const timeUntil = start.until(now, { largestUnit: 'days' })
  const duration = Temporal.Duration.from(timeUntil).total({ unit: 'days' })
  return duration < 0 && duration > days
}

export function getTimeInstant(ts: number | undefined | null) {
  if (!ts) return ''
  return Temporal.Instant
    .fromEpochMilliseconds(ts)
    .toZonedDateTimeISO('America/Los_Angeles')
    .toPlainDate()
}

export function shortenYear(year: number) {
  return year.toString().slice(2)
}

export function shortDate(unix: number | null | undefined) {
  const instant = getTimeInstant(unix)
  if (!instant) return undefined

  const currYear = new Date().getFullYear()
  const isCurrYear = instant?.year === currYear
  const moDay = `${instant?.month}/${instant?.day}`
  return isCurrYear ? moDay : `${moDay}/${shortenYear(instant?.year)}`
}

export function useReadableDate() {
  return ({ timestamp, readable }: { timestamp: number; readable: string }): void => {
    return useConvertSyncRefs(timestamp, readable, unixToDate, dateToUnix)
  }
}
