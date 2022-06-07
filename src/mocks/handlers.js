import { rest } from 'msw'
import bids from './data/bids.json'
import clients from './data/clients.json'
import contacts from './data/contacts.json'
import employees from './data/employees.json'
import jobs from './data/jobs.json'
import line_items from './data/line_items.json'
import workorders from './data/workorders.json'

export const handlers = [
  rest.get('/mock-api', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        bids,
        clients,
        contacts,
        employees,
        jobs,
        line_items,
        workorders,
      }),
    )
  }),
]
