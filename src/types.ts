type Id = string | number

export interface Employee {
  id: Id
  name: string
  position: string
  email?: string
  phone?: string
}

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

export interface Workorder {
  id: Id
  'FK|client_id': Id
  'FK|employee_id'?: Id
  'FK|contact_id'?: Id
  'FK|job_id'?: Id
  'FK|bid_id'?: Id
  start_date?: number
  due_date?: number
  description?: string
  parking_info?: string
  notes?: string
  bill_type: string
  job_type: string
  created_at: number
  udpated_at?: number
  closed_at?: number
  status: string
}

export interface Header {
  key: string
  title: string
}

