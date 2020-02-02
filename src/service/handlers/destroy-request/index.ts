import { destroy as destroyEvent } from '../../events'
import { CronStore } from '../../../types'

const createDestroyRequestHandler = (cronStore: CronStore) => {
  return destroyEvent.request.createHandler(async (message, dispatch) => {
    const { id } = message.payload

    await cronStore.destroy(id)
  })
}

export default createDestroyRequestHandler
