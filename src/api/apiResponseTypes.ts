interface DataRowBase {
  id: Id
}

type Id = string

export interface Employee extends DataRowBase {
  name: string
  position: string
  email?: string
  phone?: string
}

export interface Contact extends DataRowBase {
  name: string
  email?: string
  'FK|client_id'?: number
  phone?: string
}
export interface ContactParsed extends Omit<Contact, 'FK|client_id'> {
  name: string
  email?: string
  'FK|client_id'?: Client
  phone?: string
}

export interface Client extends DataRowBase {
  name: string
  email?: string
  address?: string
}

export interface Project extends DataRowBase {
  'FK|client_id': Id
  'FK|contact_id'?: Id
  prevailing_wage: boolean
  job_folder_id: string
  address?: string
  job_name?: string
  status: string
  billing_type: string
  closed_date?: number
}

export interface ProjectParsed extends Omit<Project, 'FK|client_id' | 'FK|contact_id'> {
  'FK|client_id': Client
  'FK|contact_id'?: Contact
  prevailing_wage: boolean
  job_folder_id: string
  address?: string
  job_name?: string
  status: string
  billing_type: string
  closed_date?: number
}

export interface Bid extends Project {
  bid_id: string
  bid_item?: string
  bid_folder_id?: string
  spreadsheet_id: string
  sent_date?: number
  total?: number
}

interface Job extends Project {
  job_number: number
  'FK|bid_id'?: Id
  sheet_id: string
  contract_total: number
  invoiced?: number
  paid?: number
  hours?: number
  change_orders?: number
  change_order_total?: number
  notes?: string
}

interface JobParsed extends Omit<Job, 'FK|bid_id'> {
  job_number: number
  'FK|bid_id'?: Bid
  sheet_id: string
  contract_total: number
  invoiced?: number
  paid?: number
  hours?: number
  change_orders?: number
  change_order_total?: number
  notes?: string
}

interface Workorder extends DataRowBase {
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
interface WorkorderParsed extends Omit<Workorder, 'FK|contact_id' | 'FK|client_id' | 'FK|bid_id' | 'FK|job_id' | 'FK|employee_id' > {
  'FK|client_id': Client
  'FK|employee_id'?: Employee
  'FK|contact_id'?: Contact
  'FK|job_id'?: Job
  'FK|bid_id'?: Bid
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

interface LineItem extends DataRowBase {
  'FK|workorder_id': Id
  description?: string
  details?: string
  quantity?: string | number
  hours: number
  item_number: number
  completed: boolean
}
interface LineItemParsed extends Omit<LineItem, 'FK|workorder_id'> {
  'FK|workorder_id': Workorder
  description?: string
  details?: string
  quantity?: string | number
  hours: number
  item_number: number
  completed: boolean
}


export type DataTableParsed =
Employee
| ContactParsed
| Client
| Bid
| JobParsed
| WorkorderParsed
| LineItemParsed

export type DataTable =
  Employee
  | Contact
  | Client
  | Bid
  | Job
  | Workorder
  | LineItem

export type TableRowKeys =
  | keyof Employee
  | keyof Contact
  | keyof Client
  | keyof Bid
  | keyof Job
  | keyof Workorder
  | keyof LineItem

export type DataTables =
  (
    | Employee
    | Contact
    | Client
    | Bid
    | Job
    | Workorder
    | LineItem)[]

type Version = String | undefined | null

export interface Versions {
  main: Version
  workorders: Version
  line_items: Version
  contacts: Version
  employees: Version
  clients: Version
  bids: Version
  jobs: Version
}

export const FindFxn = <T extends DataRowBase>(arg: T[]) => {
  return arg.find((e: T) => e.id === '1')
}

export interface ErrorWithMessage {
  message: string
}

