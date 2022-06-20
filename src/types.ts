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

export const dataTypeValidator = z.object({
  employees: employeeValidator,
  workorders: workorderValidator,
  bids: bidValidator,
  jobs: jobValidator,
  contacts: contactValidator,
  clients: clientValidator,
  line_items: lineitemValidator,
})

export type DataType = z.infer<typeof dataTypeValidator>

export const tableRowValidator = z.union([
  employeeValidator,
  workorderValidator,
  bidValidator,
  jobValidator,
  contactValidator,
  clientValidator,
  lineitemValidator,
])

const TableNamesEnum = z.enum(['employees', 'workorders', 'jobs', 'bids', 'contacts', 'clients', 'line_items'])
const VersionNamesEnum = z.enum(['main', 'employees', 'workorders', 'jobs', 'bids', 'contacts', 'clients', 'line_items'])

export const backendDataValidator = z.array(dataTypeValidator)

export const tableDataValidator = z.array(tableRowValidator)

export type BackendData = z.infer<typeof backendDataValidator>

export const packValidator = z.object({
  id: z.string(),
  name: z.string(),
  data: tableDataValidator,
  sheetId: z.number(),
  version: z.string(),
})

export const dataResponseValidator = z.object({
  employees: packValidator.optional(),
  workorders: packValidator.optional(),
  bids: packValidator.optional(),
  jobs: packValidator.optional(),
  contacts: packValidator.optional(),
  clients: packValidator.optional(),
  line_items: packValidator.optional(),
})

export type Data = z.infer<typeof dataResponseValidator>

// export const versionValidator = z.record(VersionNamesEnum, z.string().optional())
export const versionValidator = z.object({
  main: z.string().optional(),
  employees: z.string().optional(),
  workorders: z.string().optional(),
  bids: z.string().optional(),
  jobs: z.string().optional(),
  contacts: z.string().optional(),
  clients: z.string().optional(),
  line_items: z.string().optional(),
})

export type VersionType = z.infer<typeof versionValidator>

export type Version = z.infer<typeof versionValidator>

export type VersionKeys = keyof Version

export const apiResponseValidator = z.object({
  ok: z.boolean(),
  data: dataResponseValidator.optional(),
  versions: versionValidator.optional(),
})

export type ApiResponse = z.infer<typeof apiResponseValidator>

export type TableKeys = keyof Data

export const storeDataValidator = z.object({
  clients: z.array(clientValidator).optional(),
  employees: z.array(employeeValidator).optional(),
  workorders: z.array(workorderValidator).optional(),
  bids: z.array(bidValidator).optional(),
  jobs: z.array(jobValidator).optional(),
  contacts: z.array(contactValidator).optional(),
  line_items: z.array(lineitemValidator).optional(),
})

export type StoreData = z.infer<typeof storeDataValidator>

export const gasTaskValidator = z.object({
  namespace: z.string(),
  action: z.string(),
  params: z.object({
    tableName: z.string().optional(),
    data: backendDataValidator.optional(),
    clientVersions: versionValidator,
  }),
})

export type GasTaskType = z.infer<typeof gasTaskValidator>

export const gasJobValidator = z.object({
  namespace: z.string(),
  tasks: z.array(gasTaskValidator),
})

export type GasJobType = z.infer<typeof gasJobValidator>

export const mutationValidator = z.object({
  table: z.string(),
  action: z.string(),
  data: dataTypeValidator.optional(),
  versions: versionValidator,
})

export type MutationType = z.infer<typeof mutationValidator>

