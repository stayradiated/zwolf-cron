import events from '../../events'
import { CronStore } from '../../../types'

const createCreateRequestHandler = (cronStore: CronStore) => {
  return events.create.request.createHandler(async (message, dispatch) => {
    const { schedule, type, payload } = message.payload

    await cronStore.create({
      schedule,
      type,
      payload,
    })
  })
}

export default createCreateRequestHandler
