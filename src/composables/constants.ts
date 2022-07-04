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
