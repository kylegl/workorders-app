import { Temporal } from '@js-temporal/polyfill'

export const parseTimestampToDate = (timestamp: string) => {
  const instant = Temporal.Instant
    .fromEpochMilliseconds(parseInt(timestamp))
    .toZonedDateTimeISO('America/Los_Angeles')
    .toPlainDate()

  return `${instant.month}/${instant.day}/${instant.year}`
}

