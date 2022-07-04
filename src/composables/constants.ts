import { lineitemValidator, workorderValidator } from '~/types'

export const jobFilters = [
  { name: 'Active', key: 'status', value: 'Active', isActive: true },
  { name: 'Upcoming', key: 'status', value: 'Upcoming', isActive: true },
  { name: 'Hold', key: 'status', value: 'Hold', isActive: false },
  { name: 'Completed', key: 'status', value: 'Completed', isActive: false },
]

export const jobSearchKeys = [
  'job_name',
  'address',
  'job_number',
  'FK|client_id.name',
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
})

export const woStatuses = ['Upcoming', 'In-progress', 'Completed', 'On-hold', 'Cancelled']

export const newWorkorder = workorderValidator.parse({
  'id': '',
  'wo_number': null,
  'FK|job_id': '',
  'FK|bid_id': '',
  'FK|client_id': '',
  'FK|contact_id': '',
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
  'FK|job_id.address',
  'FK|job_id.job_number',
]

export const billingOptions = ['T&M', 'Fixed']
export const jobTypeOptions = ['Finishing', 'Painting']
