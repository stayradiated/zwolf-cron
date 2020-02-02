import { create as createEvent } from '../../events'
import { CronStore } from '../../../types'

const createCreateRequestHandler = (cronStore: CronStore) => {
  return createEvent.request.createHandler(async (message, dispatch) => {
    const { schedule, type, payload } = message.payload

    await cronStore.create({
      schedule,
      type,
      payload,
    })
  })
}

export default createCreateRequestHandler
