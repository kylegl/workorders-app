export const jobFilters = [
  { name: 'Active', key: 'status', value: 'Active' },
  { name: 'Upcoming', key: 'status', value: 'Upcoming' },
  { name: 'Hold', key: 'status', value: 'Hold' },
  { name: 'Completed', key: 'status', value: 'Completed' },
]

export const jobSearchKeys = [
  'job_name',
  'address',
  'job_number',
  'FK|client_id.name',
]

export const workorderStatusOptions = ['Upcoming', 'In-progress', 'Completed', 'On-hold', 'Cancelled']
export const billingOptions = ['T&M', 'Fixed']
export const jobTypeOptions = ['Finishing', 'Painting']
export const newWorkorder = {
  'id': useUid(),
  'FK|job_id': '',
  'FK|bid_id': '',
  'FK|client_id': '',
  'FK|contact_id': '',
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
  'status': '',
}

