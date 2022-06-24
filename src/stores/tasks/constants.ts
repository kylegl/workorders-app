import { lineitemValidator } from '~/types'

export const newTask = lineitemValidator.parse({
  id: '',
  workorder_id: '',
  description: '',
  details: '',
  quantity: '',
  hours: 0,
  notes: '',
  item_number: null,
  completed: false,
})
