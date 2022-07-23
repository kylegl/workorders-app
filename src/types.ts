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
  'FK|property_id'?: Id
  job_number: number
  prevailing_wage: boolean
  job_folder_id: string
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
  wo_number: number
  'FK|client_id': Id
  'FK|employee_id'?: Id
  'FK|contact_id'?: Id
  'FK|job_id'?: Id
  'FK|bid_id'?: Id
  'FK|property_id'?: Id
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

const emailOrUndefined = z.union([z.nullable(z.string().email()), z.undefined(), z.literal('')])

const numberOrString = z.union([stringOrUndefined, numberOrUndefined])

export const deltaValidator = z.object({
  ops: z.array(z.object({
    insert: z.string().optional(),
    attributes: z.object({
      list: z.string(),
    }).optional(),
  })),
})

export const stringOrDelta = z.union([stringOrUndefined, deltaValidator])
export const stringOrNumberOrDelta = z.union([numberOrString, deltaValidator])

const parseJSON = (val: unknown) => {
  try {
    return JSON.parse(val)
  }
  catch (e) {
    return val
  }
}
const casteToJSON = z.preprocess(val => parseJSON(val), stringOrNumberOrDelta)
const castJSONtoString = z.preprocess(val => JSON.stringify(val), stringOrNumberOrDelta)
const castStringToNumber = z.preprocess(val => val === '' ? undefined : typeof val === 'string' ? +val : val, numberOrUndefined)

export const employeeValidator = z.object({
  id: z.string(),
  name: z.string({
    required_error: 'Name is required',
  }),
  email: emailOrUndefined,
  phone: numberOrString,
  position: stringOrUndefined,
})

export type EmployeeType = z.infer<typeof employeeValidator>

export const incomingWorkorderValidator = z.object({
  'id': z.string(),
  'wo_number': numberOrUndefined,
  'FK|client_id': z.string(),
  'FK|employee_id': stringOrUndefined,
  'FK|contact_id': stringOrUndefined,
  'FK|job_id': stringOrUndefined,
  'FK|bid_id': stringOrUndefined,
  'FK|property_id': stringOrUndefined,
  'start_date': castStringToNumber,
  'due_date': castStringToNumber,
  'description': casteToJSON,
  'parking_info': casteToJSON,
  'notes': casteToJSON,
  'bill_type': stringOrUndefined,
  'job_type': stringOrUndefined,
  'created_at': castStringToNumber,
  'udpated_at': castStringToNumber,
  'closed_at': castStringToNumber,
  'status': z.string(),
})

export const propertyValidator = z.object({
  id: z.string(),
  address: z.string(),
  gate_code: z.number().nullable().optional(),
})

export type PropertyType = z.infer<typeof propertyValidator>

export const workorderValidator = z.object({
  'id': z.string(),
  'wo_number': numberOrUndefined,
  'FK|client_id': z.string(),
  'FK|employee_id': stringOrUndefined,
  'FK|contact_id': stringOrUndefined,
  'FK|job_id': stringOrUndefined,
  'FK|bid_id': stringOrUndefined,
  'FK|property_id': z.string().optional(),
  'start_date': numberOrUndefined,
  'due_date': numberOrUndefined,
  'description': stringOrDelta,
  'parking_info': stringOrDelta,
  'notes': stringOrDelta,
  'bill_type': stringOrUndefined,
  'job_type': stringOrUndefined,
  'created_at': numberOrUndefined,
  'udpated_at': numberOrUndefined,
  'closed_at': numberOrUndefined,
  'status': z.string(),
})

export type WorkorderType = z.infer<typeof workorderValidator>

export const outgoingWorkorderValidator = z.object({
  'id': z.string(),
  'wo_number': numberOrUndefined,
  'FK|client_id': z.string(),
  'FK|employee_id': stringOrUndefined,
  'FK|contact_id': stringOrUndefined,
  'FK|job_id': stringOrUndefined,
  'FK|bid_id': stringOrUndefined,
  'FK|property_id': z.string().optional(),
  'start_date': numberOrUndefined,
  'due_date': numberOrUndefined,
  'description': castJSONtoString,
  'parking_info': castJSONtoString,
  'notes': castJSONtoString,
  'bill_type': stringOrUndefined,
  'job_type': stringOrUndefined,
  'created_at': numberOrUndefined,
  'udpated_at': numberOrUndefined,
  'closed_at': numberOrUndefined,
  'status': z.string(),
})

export const jobValidator = z.object({
  'id': z.string(),
  'FK|client_id': z.string(),
  'FK|contact_id': stringOrUndefined,
  'FK|bid_id': stringOrUndefined,
  'FK|property_id': z.string().optional(),
  'job_number': numberOrString,
  'prevailing_wage': z.boolean(),
  'job_folder_id': z.string(),
  'job_name': stringOrUndefined,
  'status': z.string(),
  'billing_type': z.string(),
  'start_date': castStringToNumber,
  'closed_date': castStringToNumber,
})

export type JobType = z.infer<typeof jobValidator>

export const bidValidator = z.object({
  'id': z.string(),
  'FK|client_id': z.string(),
  'FK|contact_id': stringOrUndefined,
  'FK|property_id': z.string().optional(),
  'bid_id': z.string(),
  'prevailing_wage': z.boolean(),
  'bid_folder_id': stringOrUndefined,
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

export type ContactType = z.infer<typeof contactValidator>

export const clientValidator = z.object({
  id: z.string(),
  name: z.string(),
  email: emailOrUndefined,
  phone: numberOrString,
  address: stringOrUndefined,
})

export const incomingLineitemValidator = z.object({
  'id': z.string(),
  'FK|workorder_id': z.string().optional(),
  'description': casteToJSON,
  'details': casteToJSON,
  'quantity': casteToJSON,
  'hours': numberOrString,
  'item_number': numberOrUndefined,
  'completed': z.boolean().optional(),
  'notes': casteToJSON,
})
export const lineitemValidator = z.object({
  'id': z.string(),
  'FK|workorder_id': z.string().optional(),
  'description': stringOrDelta,
  'details': stringOrDelta,
  'quantity': stringOrNumberOrDelta,
  'hours': numberOrString,
  'item_number': numberOrUndefined,
  'completed': z.boolean().optional(),
  'notes': stringOrDelta,
})

export type Lineitem = z.infer<typeof lineitemValidator>

export const outgoingLineitemValidator = z.object({
  'id': z.string(),
  'FK|workorder_id': z.string().optional(),
  'description': castJSONtoString,
  'details': castJSONtoString,
  'quantity': castJSONtoString,
  'hours': numberOrString,
  'item_number': numberOrUndefined,
  'completed': z.boolean().optional(),
  'notes': castJSONtoString,
})

export const versionValidator = z.object({
  main: stringOrUndefined,
  employees: stringOrUndefined,
  workorders: stringOrUndefined,
  bids: stringOrUndefined,
  jobs: stringOrUndefined,
  contacts: stringOrUndefined,
  clients: stringOrUndefined,
  line_items: stringOrUndefined,
  properties: stringOrUndefined,
})

export type VersionType = z.infer<typeof versionValidator>

export type Version = z.infer<typeof versionValidator>

export type VersionKeys = keyof Version

export const packValidator = z.discriminatedUnion('table', [
  z.object({ table: z.literal('jobs'), data: z.array(jobValidator), version: z.string().optional() }),
  z.object({ table: z.literal('bids'), data: z.array(bidValidator), version: z.string().optional() }),
  z.object({ table: z.literal('contacts'), data: z.array(contactValidator), version: z.string().optional() }),
  z.object({ table: z.literal('clients'), data: z.array(clientValidator), version: z.string().optional() }),
  z.object({ table: z.literal('employees'), data: z.array(employeeValidator), version: z.string().optional() }),
  z.object({ table: z.literal('workorders'), data: z.array(incomingWorkorderValidator), version: z.string().optional() }),
  z.object({ table: z.literal('line_items'), data: z.array(incomingLineitemValidator), version: z.string().optional() }),
  z.object({ table: z.literal('properties'), data: z.array(propertyValidator), version: z.string().optional() }),
])

export const mutationValidator = z.discriminatedUnion('table', [
  z.object({ table: z.literal('jobs'), data: jobValidator }),
  z.object({ table: z.literal('bids'), data: bidValidator }),
  z.object({ table: z.literal('contacts'), data: contactValidator }),
  z.object({ table: z.literal('clients'), data: clientValidator }),
  z.object({ table: z.literal('employees'), data: employeeValidator }),
  z.object({ table: z.literal('workorders'), data: outgoingWorkorderValidator }),
  z.object({ table: z.literal('line_items'), data: outgoingLineitemValidator }),
  z.object({ table: z.literal('properties'), data: z.array(propertyValidator)}),
])

export const dataResponseValidator = z.object({
  employees: packValidator.optional(),
  workorders: packValidator.optional(),
  bids: packValidator.optional(),
  jobs: packValidator.optional(),
  contacts: packValidator.optional(),
  clients: packValidator.optional(),
  line_items: packValidator.optional(),
  properties: packValidator.optional(),
})

export type Data = z.infer<typeof dataResponseValidator>

export const apiResponseValidator = z.object({
  ok: z.boolean(),
  data: dataResponseValidator.optional(),
  versions: versionValidator.optional(),
})

export type ApiResponse = z.infer<typeof apiResponseValidator>

export const tableKeyEnum = z.enum(['jobs', 'bids', 'contacts', 'clients', 'employees', 'workorders', 'line_items', 'properties'])

export type TableKey = z.infer<typeof tableKeyEnum>

export const storeDataValidator = z.object({
  clients: z.array(clientValidator).optional(),
  employees: z.array(employeeValidator).optional(),
  workorders: z.array(workorderValidator).optional(),
  bids: z.array(bidValidator).optional(),
  jobs: z.array(jobValidator).optional(),
  contacts: z.array(contactValidator).optional(),
  line_items: z.array(lineitemValidator).optional(),
  properties: z.array(propertyValidator).optional(),
})

export type StoreData = z.infer<typeof storeDataValidator>

export type MutationType = z.infer<typeof mutationValidator>

export const getRequestValidator = z.object({
  method: z.string(),
  path: z.string(),
  cache: versionValidator.optional(),
})

export type RequestType = z.infer<typeof getRequestValidator>

export const TableRow = z.union([
  clientValidator,
  employeeValidator,
  workorderValidator,
  bidValidator,
  jobValidator,
  contactValidator,
  lineitemValidator,
])

export type TableRowKey = keyof TableRow

export type TableRowType = z.infer<typeof TableRow>


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

export interface ErrorWithMessage {
  message: string
}

export const dirtValidator = z.tuple([
  z.string(),
  z.boolean(),
])

export type Dirt = z.infer<typeof dirtValidator>

export const moveValidator = z.object({
  task: lineitemValidator,
  delta: z.number(),
})

export type Move = z.infer<typeof moveValidator>

export const jobParsedValidator = z.object({
  'id': z.string(),
  'FK|client_id': clientValidator,
  'FK|contact_id': contactValidator,
  'FK|bid_id': bidValidator,
  'FK|property_id': propertyValidator.optional(),
  'job_number': numberOrString,
  'prevailing_wage': z.boolean(),
  'job_folder_id': z.string(),
  'job_name': stringOrUndefined,
  'status': z.string(),
  'billing_type': z.string(),
  'start_date': castStringToNumber,
  'closed_date': castStringToNumber,
})

export type JobParsedType = z.infer<typeof jobParsedValidator>

export const parsedWorkorderValidator = z.object({
  'id': z.string(),
  'wo_number': numberOrUndefined,
  'FK|client_id': clientValidator.optional(),
  'FK|employee_id': employeeValidator.optional(),
  'FK|contact_id': contactValidator.optional(),
  'FK|job_id': jobValidator.optional(),
  'FK|bid_id': bidValidator.optional(),
  'FK|property_id': propertyValidator.optional(),
  'start_date': castStringToNumber,
  'due_date': castStringToNumber,
  'description': stringOrDelta,
  'parking_info': stringOrDelta,
  'notes': stringOrDelta,
  'bill_type': stringOrUndefined,
  'job_type': stringOrUndefined,
  'created_at': castStringToNumber,
  'udpated_at': castStringToNumber,
  'closed_at': castStringToNumber,
  'status': z.string(),
})

export type ParsedWorkorderType = z.infer<typeof parsedWorkorderValidator>

export const sortKeyValidator = z.object({
  name: z.string(),
  key: z.string(),
  isString: z.boolean(),
  isActive: z.boolean(),
  isReverse: z.boolean(),
})

export type SortKey = z.infer<typeof sortKeyValidator>

export const sortKeyArrayValidator = z.array(sortKeyValidator)

export type SortKeyArray = z.infer<typeof sortKeyArrayValidator>
