type Id = number | string

type Employee = {
  id: Id
  name: string
  position: string
  email: string
  phone: string
}

interface Employees extends Array<Employee> {}

type Contact = {
  id: Id
  name: string
  email: string
  client_id: number
  phone: string
}

interface Contacts extends Array<Contact> {}

type Client = {
  id: Id
  name: string
  email: string
  address: string
}

interface Clients extends Array<Client> {}

type Project = {
  id: Id
  client_id: Id
  contact_id?: Id
  prevailing_wage: boolean
  job_folder_id: string
  address?: string
  job_name?: string
  status: string
  billing_type: string
  closed_date?: number
}

interface Bid extends Project {
  bid_id: string
  bid_item?: string
  bid_folder_id?: string
  spreadsheet_id: string
  sent_date: number
  total?: number
}

interface Bids extends Array<Bid> {}

interface Job extends Project {
  job_number: number
  sheet_id: string
  contract_total: number
  invoiced?: number
  paid?: number
  hours?: number
  change_orders?: number
  change_order_total?: number
  notes?: string
}

interface Jobs extends Array<Job> {}

type Workorder = {
  id: Id
  client_id: Id
  employee_id?: Id
  contact_id?: Id
  job_id?: Id
  bid_id?: Id
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

interface Workorders extends Array<Workorder> {}

type LineItem = {
  id: Id
  workorder_id: Id
  description?: string
  details?: string
  quantity?: string | number
  hours: number
  item_number: number
  completed: boolean
}

interface LineItems extends Array<LineItem> {}

interface BackendData {
  employees: Employee[]
  contacts: Contact[]
  clients: Client[]
  bids: Bid[]
  jobs: Job[]
  workorders: Workorder[]
  lineItems: LineItem[]
}

export interface ApiResponse {
  obj: BackendData | undefined
}

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
