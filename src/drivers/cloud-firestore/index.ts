import * as db from '@zwolf/firestore'
import { DispatchFn } from '@zwolf/turbine'

import { CronJob, CronStore } from '../../types'
import { FirestoreCronJobCollection } from './firestore'
import { execute } from './execute'

class CloudFirestoreCronStore implements CronStore {
  async create (job: Omit<CronJob, 'id'>) {
    const doc = await db.add(FirestoreCronJobCollection, {
      ...job,
      createdAt: db.value('serverDate'),
      updatedAt: db.value('serverDate'),
      lastRunAt: null,
      nextRunAt: null,
    })

    return {
      ...doc.data,
      id: doc.ref.id,
    }
  }

  async update (job: CronJob) {
    const { id } = job
    await db.update(FirestoreCronJobCollection, id, {
      ...job,
      updatedAt: db.value('serverDate'),
    })
  }

  async destroy (jobId: string) {
    await db.remove(FirestoreCronJobCollection, jobId)
  }

  async read (jobId: string) {
    const doc = await db.get(FirestoreCronJobCollection, jobId)
    return {
      ...doc.data,
      id: doc.ref.id,
    }
  }

  async readAll () {
    const docs = await db.all(FirestoreCronJobCollection)
    return docs.map((doc) => ({
      ...doc.data,
      id: doc.ref.id,
    }))
  }

  async execute (dispatch: DispatchFn) {
    return execute(dispatch)
  }
}

export default CloudFirestoreCronStore
