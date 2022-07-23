import { rest } from 'msw'
import bids from './data/bids.json'
import clients from './data/clients.json'
import contacts from './data/contacts.json'
import employees from './data/employees.json'
import jobs from './data/jobs.json'
import lineItems from './data/line_items.json'
import workorders from './data/workorders.json'
import properties from './data/properties.json'

export const handlers = [
  rest.get('/mock-api', (req, res, ctx) => {
    return res(
      ctx.json({
        ok: true,
        data: {
          bids: {
            table: 'bids',
            data: bids,
          },
          clients: {
            table: 'clients',
            data: clients,
          },
          contacts: {
            table: 'contacts',
            data: contacts,
          },
          employees: {
            table: 'employees',
            data: employees,
          },
          jobs: {
            table: 'jobs',
            data: jobs,
          },
          line_items: {
            table: 'line_items',
            data: lineItems,
          },
          workorders: {
            table: 'workorders',
            data: workorders,
          },
          properties: {
            table: 'properties',
            data: properties,
          },
        },
        versions: {
          main: 'a',
          bids: 'b',
          clients: 'c',
          contacts: 'd',
          employees: 'e',
          jobs: 'f',
          line_items: 'g',
          workorders: 'h',
          properties: 'i',
        },
      }),
    )
  }),
]
