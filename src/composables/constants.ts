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

export const woFilters = [
  { name: 'Active', key: 'status', value: 'Active', isActive: true },
  { name: 'Upcoming', key: 'status', value: 'Upcoming', isActive: true },
  { name: 'Hold', key: 'status', value: 'Hold', isActive: false },
  { name: 'Completed', key: 'status', value: 'Completed', isActive: false },
]

export const woSearchKeys = [
  'job_name',
  'address',
  'job_number',
  'FK|client_id.name',
]

export const billingOptions = ['T&M', 'Fixed']
export const jobTypeOptions = ['Finishing', 'Painting']
