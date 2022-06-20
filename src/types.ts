import { string, z } from 'zod'

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
const stringOrUndefined = z.union([z.nullable(z.string()), z.undefined()])

const numberOrUndefined = z.union([z.nullable(z.number()), z.undefined()])

const emailOrUndefined = z.union([z.nullable(z.string().email()), z.undefined()])

const numberOrString = z.union([stringOrUndefined, numberOrUndefined])

export const employeeValidator = z.object({
  id: z.string(),
  name: z.string(),
  email: emailOrUndefined,
  phone: numberOrString,
  position: stringOrUndefined,
})

export const workorderValidator = z.object({
  'id': z.string(),
  'FK|client_id': z.string(),
  'FK|employee_id': stringOrUndefined,
  'FK|contact_id': stringOrUndefined,
  'FK|job_id': stringOrUndefined,
  'FK|bid_id': stringOrUndefined,
  'start_date': numberOrString,
  'due_date': numberOrString,
  'description': stringOrUndefined,
  'parking_info': stringOrUndefined,
  'notes': stringOrUndefined,
  'bill_type': stringOrUndefined,
  'job_type': stringOrUndefined,
  'created_at': numberOrString,
  'udpated_at': numberOrString,
  'closed_at': numberOrString,
  'status': z.string(),
})

export const jobValidator = z.object({
  'id': z.string(),
  'FK|client_id': z.string(),
  'FK|contact_id': stringOrUndefined,
  'job_number': numberOrString,
  'prevailing_wage': z.boolean(),
  'job_folder_id': z.string(),
  'address': stringOrUndefined,
  'job_name': stringOrUndefined,
  'status': z.string(),
  'billing_type': z.string(),
  'closed_date': numberOrString,
})

export const bidValidator = z.object({
  'id': z.string(),
  'FK|client_id': z.string(),
  'FK|contact_id': stringOrUndefined,
  'bid_id': z.string(),
  'prevailing_wage': z.boolean(),
  'bid_folder_id': stringOrUndefined,
  'address': stringOrUndefined,
  'job_name': stringOrUndefined,
  'status': z.string(),
  'billing_type': z.string(),
  'sent_date': numberOrString,
  'speadsheet_id': stringOrUndefined,
  'bid_item': stringOrUndefined,
  'total': numberOrString,
  'job_folder_id': stringOrUndefined,
  'closed_date': numberOrString,
})

export const contactValidator = z.object({
  'id': z.string(),
  'name': z.string(),
  'email': stringOrUndefined,
  'FK|client_id': stringOrUndefined,
  'phone': numberOrString,
})

export const clientValidator = z.object({
  id: z.string(),
  name: z.string(),
  email: emailOrUndefined,
  phone: numberOrString,
  address: stringOrUndefined,
})

export const lineitemValidator = z.object({
  'id': z.string(),
  'FK|workorder_id': z.string(),
  'description': stringOrUndefined,
  'details': stringOrUndefined,
  'quantity': numberOrString,
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

export const packValidator = z.discriminatedUnion('table', [
  z.object({ table: z.literal('jobs'), data: z.array(jobValidator), version: z.string().optional() }),
  z.object({ table: z.literal('bids'), data: z.array(bidValidator), version: z.string().optional() }),
  z.object({ table: z.literal('contacts'), data: z.array(contactValidator), version: z.string().optional() }),
  z.object({ table: z.literal('clients'), data: z.array(clientValidator), version: z.string().optional() }),
  z.object({ table: z.literal('employees'), data: z.array(employeeValidator), version: z.string().optional() }),
  z.object({ table: z.literal('workorders'), data: z.array(workorderValidator), version: z.string().optional() }),
  z.object({ table: z.literal('line_items'), data: z.array(lineitemValidator), version: z.string().optional() }),
])

export const backendDataValidator = z.array(dataTypeValidator)

export type BackendData = z.infer<typeof backendDataValidator>

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

// export const versionValidator = z.record(VersionNamesEnum, stringOrUndefined)
export const versionValidator = z.object({
  main: stringOrUndefined,
  employees: stringOrUndefined,
  workorders: stringOrUndefined,
  bids: stringOrUndefined,
  jobs: stringOrUndefined,
  contacts: stringOrUndefined,
  clients: stringOrUndefined,
  line_items: stringOrUndefined,
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

export const tableKeyEnum = z.enum(['jobs', 'bids', 'contacts', 'clients', 'employees', 'workorders', 'line_items'])

export type TableKey = z.infer<typeof tableKeyEnum>

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
    tableName: stringOrUndefined,
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

