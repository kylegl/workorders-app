import { employeeValidator, incomingWoValidator, lineitemValidator } from '~/types'

export const jobFilters = [
  { name: 'Active', key: 'status', value: 'Active', isActive: true },
  { name: 'Upcoming', key: 'status', value: 'Upcoming', isActive: true },
  { name: 'Hold', key: 'status', value: 'Hold', isActive: false },
  { name: 'Completed', key: 'status', value: 'Completed', isActive: false },
]

export const jobSearchKeys = [
  'job_name',
  'FK|property_id.address',
  'job_number',
  'FK|client_id.name',
]

export const jobSortKeys = [
  { name: 'Start Date', key: 'start_date', isString: false, isActive: false, isReverse: false },
  { name: 'Client', key: 'FK|client_id.name', isString: true, isActive: false, isReverse: false },
]

export const newTask = lineitemValidator.parse({
  id: '',
  workorder_id: '',
  description: '',
  details: '',
  quantity: '',
  hours: 0,
  notes: '',
  item_number: null,
  completed: false,
  created_at: null,
  updated_at: null,
})

export const woStatuses = ['Upcoming', 'In-progress', 'Completed', 'On-hold', 'Cancelled']

export const newWorkorder = incomingWoValidator.parse({
  'id': '',
  'wo_number': null,
  'FK|job_id': '',
  'FK|bid_id': '',
  'FK|client_id': '',
  'FK|contact_id': [],
  'FK|employee_id': [],
  'start_date': null,
  'due_date': null,
  'description': '',
  'parking_info': '',
  'notes': '',
  'bill_type': '',
  'job_type': '',
  'created_at': +new Date(),
  'updated_at': null,
  'closed_at': null,
  'status': 'Upcoming',
})

export const woFilters = [
  { name: 'Active', key: 'status', value: 'Active', isActive: true },
  { name: 'Upcoming', key: 'status', value: 'Upcoming', isActive: true },
  { name: 'Hold', key: 'status', value: 'Hold', isActive: false },
  { name: 'Completed', key: 'status', value: 'Completed', isActive: false },
]

export const woSortKeys = [
  { name: 'Start Date', key: 'start_date', isString: false, isActive: false, isReverse: false },
  { name: 'Client', key: 'FK|client_id.name', isString: true, isActive: false, isReverse: false },
  { name: 'Assigned', key: 'FK|employee_id.name', isString: true, isActive: false, isReverse: false },
]

export const woSearchKeys = [
  'job_name',
  'address',
  'wo_number',
  'FK|client_id.name',
  'FK|employee_id.name',
  'FK|job_id.job_name',
  'FK|property_id.address',
  'FK|job_id.job_number',
]

export const billingOptions = ['T&M', 'Fixed']
export const jobTypeOptions = ['Finishing', 'Painting']

export const statusColors = {
  'Upcoming': 'bg-blue-500/80 shadow-blue-500/50',
  'In-progress': 'bg-green-500/80 shadow-green-500/50',
  'Active': 'bg-green-500/80 shadow-green-500/50',
  'Cancelled': 'bg-bg-drk-c/50 shadow-bg-drk-c-/50',
  'On-hold': 'bg-orange-500/80 shadow-orange-500/50',
  'Hold': 'bg-orange-500/80 shadow-orange-500/50',
  'Completed': 'bg-bg-drk-c shadow-bg-drk-c',
  'danger': 'bg-red-500/80 shadow-red-500/50',
  'warning': 'bg-yellow-500/80 shadow-yellow-500/50',
}

export const newEmployee = employeeValidator.parse({
  id: '',
  name: '',
  email: '',
  phone: '',
  created_at: null,
  updated_at: null,
})

export const employeePositions = ['Manager', 'Painter', 'Supervisor']

export function newClient() {
  return {
    id: useUid(),
    name: '',
    address: '',
    phone: '',
    email: '',
    notes: '',
    created_at: +new Date(),
    updated_at: null,
  }
}

export function newJob() {
  return {
    'id': useUid(),
    'job_name': '',
    'job_number': '',
    'FK|client_id': '',
    'FK|property_id': '',
    'FK|employee_id': '',
    'start_date': null,
    'due_date': null,
    'description': '',
    'parking_info': '',
    'notes': '',
    'bill_type': '',
    'job_type': '',
    'created_at': +new Date(),
    'updated_at': null,
    'closed_at': null,
    'status': 'Upcoming',
  }
}

export function newProperty() {
  return {
    id: useUid(),
    address: '',
    gate_code: '',
    created_at: +new Date(),
    updated_at: null,
  }
}
