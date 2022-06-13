type Id = string | number

export interface Task {
  id: Id
  'FK|workorder_id': Id
  description?: string
  details?: string
  quantity?: string | number
  hours: number
  item_number: number
  completed: boolean
}

export interface Header {
  key: string
  title: string
}
