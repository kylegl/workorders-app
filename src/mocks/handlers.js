import { rest } from 'msw'
import bids from './data/bids.json'
import clients from './data/clients.json'
import contacts from './data/contacts.json'
import employees from './data/employees.json'
import jobs from './data/jobs.json'
import lineItems from './data/line_items.json'
import workorders from './data/workorders.json'

export const handlers = [
  rest.get('/mock-api', (req, res, ctx) => {
    return res(
      ctx.json({
        ok: true,
        data: {
          bids,
          clients,
          contacts,
          employees,
          jobs,
          lineItems,
          workorders,
        },
        versions: {
          main: 'a',
          bids: 'b',
          clients: 'c',
          contacts: 'd',
          employees: 'e',
          jobs: 'f',
          lineItems: 'g',
          workorders: 'h',
        },
      }),
    )
  }),
]
