import { gasMutation, gasQuery } from './gas.js'

const isGoogle: boolean = import.meta.env.VITE_GOOGLE

const Query = async (): Promise<ApiResponse> => {
  let res

  if (isGoogle) {
    const result = await gasQuery()
    res = result
  }

  const response = await fetch('http://localhost:3333/mock-api')
  if (response.ok) {
    const result = await response.json()

    res = result
  }

  return res
}

async function Mutation({ items }): Promise<any> {
  if (isGoogle)
    return gasMutation({ items })
}

export { Query, Mutation }



type Id = number | string

export interface Employee {
  id: Id
  name: string
  position: string
  email: string
  phone: string
}

export interface Employees extends Array<Employee> {}

export interface Contact {
  id: Id
  name: string
  email: string
  client_id: number
  phone: string
}

export interface Contacts extends Array<Contact> {}

export interface Client {
  id: Id
  name: string
  email: string
  address: string
}

export interface Clients extends Array<Client> {}

export interface Project {
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

export interface Bid extends Project {
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

interface Workorder {
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

interface LineItem {
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
  employees: Employees[]
  contacts: Contacts[]
  clients: Clients[]
  bids: Bids[]
  jobs: Jobs[]
  workorders: Workorders[]
  lineItems: LineItems[]
}

export interface ApiResponse {
  response: BackendData | undefined
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
