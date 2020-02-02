import { createService } from '@zwolf/service'

import CronStore from '../drivers/cloud-firestore'
import { create, destroy } from './events'
import createCreateRequestHandler from './handlers/create-request'
import createDestroyRequestHandler from './handlers/destroy-request'

const startService = async () => {
  const cronStore = new CronStore()
  const service = createService()

  service.handle(create.request.type, createCreateRequestHandler(cronStore))
  service.handle(destroy.request.type, createDestroyRequestHandler(cronStore))

  const { router } = await service.start()

  router.post('/cron/execute', async (req, res) => {
    await cronStore.execute(service.dispatch)
    res.status(200).end()
  })
}

export default startService
