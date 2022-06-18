import { z } from 'zod'

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

const numberOrString = z.union([z.number(), z.string()])

export const employeeValidator = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email().optional(),
  phone: numberOrString.optional(),
  position: z.string().optional(),
})

export const workorderValidator = z.object({
  'id': z.string(),
  'FK|client_id': z.string(),
  'FK|employee_id': z.string().optional(),
  'FK|contact_id': z.string().optional(),
  'FK|job_id': z.string().optional(),
  'FK|bid_id': z.string().optional(),
  'start_date': numberOrString.optional(),
  'due_date': numberOrString.optional(),
  'description': z.string().optional(),
  'parking_info': z.string().optional(),
  'notes': z.string().optional(),
  'bill_type': z.string().optional(),
  'job_type': z.string().optional(),
  'created_at': numberOrString.optional(),
  'udpated_at': numberOrString.optional(),
  'closed_at': numberOrString.optional(),
  'status': z.string(),
})

export const jobValidator = z.object({
  'id': z.string(),
  'FK|client_id': z.string(),
  'FK|contact_id': z.string().optional(),
  'job_number': z.number(),
  'prevailing_wage': z.boolean(),
  'job_folder_id': z.string(),
  'address': z.string().optional(),
  'job_name': z.string().optional(),
  'status': z.string(),
  'billing_type': z.string(),
  'closed_date': numberOrString.optional(),
})

export const bidValidator = z.object({
  'id': z.string(),
  'FK|client_id': z.string(),
  'FK|contact_id': z.string().optional(),
  'bid_id': z.string(),
  'prevailing_wage': z.boolean(),
  'bid_folder_id': z.string().optional(),
  'address': z.string().optional(),
  'job_name': z.string().optional(),
  'status': z.string(),
  'billing_type': z.string(),
  'sent_date': numberOrString.optional(),
  'speadsheet_id': z.string().optional(),
  'bid_item': z.string().optional(),
  'total': numberOrString.optional(),
  'job_folder_id': z.string().optional(),
  'closed_date': numberOrString.optional(),
})

export const contactValidator = z.object({
  'id': z.string(),
  'name': z.string(),
  'email': z.string().optional(),
  'FK|client_id': z.string().optional(),
  'phone': numberOrString.optional(),
})

export const clientValidator = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email().optional(),
  phone: numberOrString.optional(),
  address: z.string().optional(),
})

export const lineitemValidator = z.object({
  'id': z.string(),
  'FK|workorder_id': z.string(),
  'description': z.string().optional(),
  'details': z.string().optional(),
  'quantity': z.string().optional(),
  'hours': z.number(),
  'item_number': z.number(),
  'completed': z.boolean(),
})

export const backendDataValidator = z.union([
  z.array(employeeValidator),
  z.array(workorderValidator),
  z.array(bidValidator),
  z.array(jobValidator),
  z.array(contactValidator),
  z.array(clientValidator),
  z.array(lineitemValidator),
])

export const packValidator = z.object({
  id: z.string(),
  name: z.string(),
  data: backendDataValidator,
  sheetId: z.number(),
  version: z.string(),
})

export const dataValidator = z.object({
  employees: packValidator.optional(),
  workorders: packValidator.optional(),
  bids: packValidator.optional(),
  jobs: packValidator.optional(),
  contacts: packValidator.optional(),
  clients: packValidator.optional(),
  line_items: packValidator.optional(),
})

export const versionValidator = z.object({
  main: z.string(),
  clients: z.string(),
  employees: z.string(),
  workorders: z.string(),
  jobs: z.string(),
  bids: z.string(),
  contacts: z.string(),
  line_items: z.string(),
})

export const apiResponseValidator = z.object({
  ok: z.boolean(),
  data: dataValidator,
  versions: versionValidator,
})

export type ApiResponse = z.infer<typeof gasResponseValidator>
