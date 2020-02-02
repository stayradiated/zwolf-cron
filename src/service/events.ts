import { createEvent } from '@zwolf/turbine-event'

const events = {
  create: createEvent<{
    schedule: string,
    type: string,
    payload: object,
  }>('cron.create'),
  destroy: createEvent<{
    id: string,
  }>('cron.destroy'),
}

export default events
