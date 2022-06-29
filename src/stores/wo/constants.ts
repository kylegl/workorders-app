import type { WorkorderType } from '~/types'
import { workorderValidator } from '~/types'

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
