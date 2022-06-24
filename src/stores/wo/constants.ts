import type { WorkorderType } from '~/types'
import { workorderValidator } from '~/types'

export const woStatuses = ['Upcoming', 'In-progress', 'Completed', 'On-hold', 'Cancelled']

export const newWorkorder = workorderValidator.parse({
  'id': '',
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

export const createWorkorder = (job: Record<string, any>): WorkorderType => {
  const workorder = newWorkorder
  workorder.id = useUid()

  if (job) {
    workorder['FK|job_id'] = job.id
    workorder['FK|bid_id'] = job['FK|bid_id']?.id
    workorder['FK|client_id'] = job['FK|client_id']?.id
    workorder['FK|contact_id'] = job['FK|contact_id']?.id
  }

  return workorderValidator.parse(workorder)
}

