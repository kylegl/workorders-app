type Id = string | number

export interface Job {
  id: Id
  'FK|client_id': Id
  'FK|contact_id'?: Id
  job_number: number
  prevailing_wage: boolean
  job_folder_id: string
  address?: string
  job_name?: string
  status: string
  billing_type: string
  closed_date?: number
}

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
