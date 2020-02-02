import { createEvent } from '@zwolf/turbine-event'

export const create = createEvent<{
  schedule: string,
  type: string,
  payload: object,
}>('cron.create')

export const destroy = createEvent<{
  id: string,
}>('cron.destroy')
