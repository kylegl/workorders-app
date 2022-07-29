import { z } from 'zod'

export interface Header {
  key: string
  title: string
}
const stringOrUndefined = z.string().nullish()

const numberOrUndefined = z.number().nullish()

const nullUndefEmpty = z.literal('').nullish()
const emailOrUndefined = z.union([z.string().email(), nullUndefEmpty])

const booleanUndef = z.union([z.boolean().nullish(), nullUndefEmpty])

const numberOrString = z.union([stringOrUndefined, numberOrUndefined])

const numberFalsy = z.union([z.number().nullable(), z.literal('')])

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])
type Literal = z.infer<typeof literalSchema>
type Json = Literal | { [key: string]: Json } | Json[]
const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
)

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
const casteToJSON = (validator: any) => z.preprocess(val => parseJSON(val), validator)
const castJSONtoString = (validator: any) => z.preprocess(val => JSON.stringify(val), validator)
const castStringToNumber = z.preprocess(val => val === '' ? undefined : typeof val === 'string' ? +val : val, numberOrUndefined)
const nullableArray = z.array(stringOrUndefined).nullable()
export const employeeValidator = z.object({
  id: z.string(),
  name: z.string({
    required_error: 'Name is required',
  }),
  email: emailOrUndefined,
  phone: numberOrString,
  position: stringOrUndefined,
  created_at: castStringToNumber,
  updated_at: castStringToNumber,
})

export type EmployeeType = z.infer<typeof employeeValidator>

export const incomingWoValidator = z.object({
  'id': z.string(),
  'wo_number': numberOrUndefined,
  'FK|client_id': z.string(),
  'FK|employee_id': casteToJSON(nullableArray),
  'FK|contact_id': casteToJSON(nullableArray),
  'FK|job_id': stringOrUndefined,
  'FK|bid_id': stringOrUndefined,
  'FK|property_id': stringOrUndefined,
  'start_date': castStringToNumber,
  'due_date': castStringToNumber,
  'description': casteToJSON(stringOrNumberOrDelta),
  'parking_info': casteToJSON(stringOrNumberOrDelta),
  'notes': casteToJSON(jsonSchema),
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
  gate_code: numberFalsy.optional(),
})

export type PropertyType = z.infer<typeof propertyValidator>

export const workorderValidator = z.object({
  'id': z.string(),
  'wo_number': numberOrUndefined,
  'FK|client_id': z.string(),
  'FK|employee_id': nullableArray,
  'FK|contact_id': nullableArray,
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
  'FK|employee_id': castJSONtoString(stringOrUndefined),
  'FK|contact_id': castJSONtoString(stringOrUndefined),
  'FK|job_id': stringOrUndefined,
  'FK|bid_id': stringOrUndefined,
  'FK|property_id': z.string().optional(),
  'start_date': numberOrUndefined,
  'due_date': numberOrUndefined,
  'description': castJSONtoString(stringOrNumberOrDelta),
  'parking_info': castJSONtoString(stringOrNumberOrDelta),
  'notes': castJSONtoString(stringOrNumberOrDelta),
  'bill_type': stringOrUndefined,
  'job_type': stringOrUndefined,
  'created_at': numberOrUndefined,
  'udpated_at': numberOrUndefined,
  'closed_at': numberOrUndefined,
  'status': z.string(),
})

export const jobValidator = z.object({
  'id': z.string(),
  'FK|client_id': z.string().optional(),
  'FK|contact_id': casteToJSON(nullableArray),
  'FK|bid_id': stringOrUndefined.optional(),
  'FK|property_id': z.string().optional(),
  'job_number': numberOrString.optional(),
  'prevailing_wage': booleanUndef,
  'job_folder_id': z.string().optional(),
  'job_name': stringOrUndefined,
  'status': z.string().optional(),
  'billing_type': z.string().optional(),
  'start_date': castStringToNumber,
  'closed_date': castStringToNumber,
})
export const stringifyArray = castJSONtoString(z.string().nullish())

export const outgoingJobValidator = jobValidator
  .omit({ 'FK|contact_id': true })
  .merge(z.object({
    'FK|contact_id': stringifyArray,
  }))

export const parseArrayString = casteToJSON(nullableArray)

export type JobType = z.infer<typeof jobValidator>

export const bidValidator = z.object({
  'id': z.string(),
  'FK|client_id': z.string(),
  'FK|contact_id': casteToJSON(nullableArray),
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

export type BidType = z.infer<typeof bidValidator>

export const contactValidator = z.object({
  'id': z.string(),
  'name': z.string(),
  'email': stringOrUndefined,
  'FK|client_id': stringOrUndefined,
  'phone': numberOrString,
  'created_at': castStringToNumber,
  'updated_at': castStringToNumber,
})

export type ContactType = z.infer<typeof contactValidator>

export const clientValidator = z.object({
  id: z.string(),
  name: z.string(),
  email: emailOrUndefined,
  phone: numberOrString,
  address: stringOrUndefined,
  created_at: castStringToNumber,
  updated_at: castStringToNumber,
})

export type ClientType = z.infer<typeof clientValidator>

export const incomingLineitemValidator = z.object({
  'id': z.string(),
  'FK|workorder_id': z.string().optional(),
  'description': casteToJSON(stringOrNumberOrDelta),
  'details': casteToJSON(stringOrNumberOrDelta),
  'quantity': casteToJSON(stringOrNumberOrDelta),
  'hours': numberOrString,
  'item_number': numberOrUndefined,
  'completed': z.boolean().optional(),
  'notes': casteToJSON(stringOrNumberOrDelta),
  'created_at': castStringToNumber,
  'updated_at': castStringToNumber,
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
  'created_at': castStringToNumber,
  'updated_at': castStringToNumber,
})

export type LineitemType = z.infer<typeof lineitemValidator>

export const outgoingLineitemValidator = z.object({
  'id': z.string(),
  'FK|workorder_id': z.string().optional(),
  'description': castJSONtoString(stringOrNumberOrDelta),
  'details': castJSONtoString(stringOrNumberOrDelta),
  'quantity': castJSONtoString(stringOrNumberOrDelta),
  'hours': numberOrString,
  'item_number': numberOrUndefined,
  'completed': z.boolean().optional(),
  'notes': castJSONtoString(stringOrNumberOrDelta),
  'created_at': castStringToNumber,
  'updated_at': castStringToNumber,
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
  z.object({ table: z.literal('workorders'), data: z.array(incomingWoValidator), version: z.string().optional() }),
  z.object({ table: z.literal('line_items'), data: z.array(incomingLineitemValidator), version: z.string().optional() }),
  z.object({ table: z.literal('properties'), data: z.array(propertyValidator), version: z.string().optional() }),
])

export const mutationValidator = z.discriminatedUnion('table', [
  z.object({ table: z.literal('jobs'), data: outgoingJobValidator.optional() }),
  z.object({ table: z.literal('bids'), data: bidValidator.optional() }),
  z.object({ table: z.literal('contacts'), data: contactValidator.optional() }),
  z.object({ table: z.literal('clients'), data: clientValidator.optional() }),
  z.object({ table: z.literal('employees'), data: employeeValidator.optional() }),
  z.object({ table: z.literal('workorders'), data: outgoingWorkorderValidator.optional() }),
  z.object({ table: z.literal('line_items'), data: outgoingLineitemValidator.optional() }),
  z.object({ table: z.literal('properties'), data: propertyValidator.optional() }),
])

export const requestDataResponseValidator = z.object({
  employees: packValidator.optional(),
  workorders: packValidator.optional(),
  bids: packValidator.optional(),
  jobs: packValidator.optional(),
  contacts: packValidator.optional(),
  clients: packValidator.optional(),
  line_items: packValidator.optional(),
  properties: packValidator.optional(),
})

export type RequestDataType = z.infer<typeof requestDataResponseValidator>

export const apiResponseValidator = z.object({
  ok: z.boolean(),
  data: requestDataResponseValidator.optional(),
  versions: versionValidator.optional(),
})

export type ApiResponse = z.infer<typeof apiResponseValidator>

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

export type StoreDataKey = keyof StoreData

export type DataEntry<T> = {
  [key in keyof T]: T[key] | DataEntryType
}

export type MutationType = z.infer<typeof mutationValidator>

export const getRequestValidator = z.object({
  method: z.string(),
  path: z.string(),
  cache: versionValidator.optional(),
})

export type RequestType = z.infer<typeof getRequestValidator>

export const tableRow = z.union([
  clientValidator,
  employeeValidator,
  workorderValidator,
  bidValidator,
  jobValidator,
  contactValidator,
  lineitemValidator,
])

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
  'FK|contact_id': z.array(contactValidator).optional(),
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
  'FK|employee_id': z.array(employeeValidator).optional(),
  'FK|contact_id': z.array(contactValidator).optional(),
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

export type DataEntryType = EmployeeType | WorkorderType | BidType | JobType | ContactType | ClientType | LineitemType | PropertyType

export type allUnionMemberKeys<T> = T extends any ? keyof T : never
export type DataEntryKeyType = allUnionMemberKeys<DataEntryType>

