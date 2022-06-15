import { Temporal } from '@js-temporal/polyfill'

export const unixToHumanDate = (timestamp: number): Date | string => {
  const instant = Temporal.Instant
    .fromEpochMilliseconds(timestamp)
    .toZonedDateTimeISO('America/Los_Angeles')
    .toPlainDate()

  return `${instant.month}/${instant.day}/${instant.year}`
}

export const unixToDate = (timestamp: number): Date | string => {
  const instant = Temporal.Instant
    .fromEpochMilliseconds(timestamp)
    .toZonedDateTimeISO('America/Los_Angeles')
    .toPlainDate()

  const month = (instant.month).toString().length === 1 ? `0${instant.month}` : instant.month
  const day = (instant.day).toString().length === 1 ? `0${instant.day}` : instant.day

  return `${instant.year}-${month}-${day}`
}

export const dateToUnix = (date: Date | string): Date | number | undefined => +new Date(date)

