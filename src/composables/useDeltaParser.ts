import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'
import type Delta from 'quill-delta'

export function parseDelta(delta: Delta) {
  const parser = new QuillDeltaToHtmlConverter(delta?.ops)
  return parser.convert()
}

