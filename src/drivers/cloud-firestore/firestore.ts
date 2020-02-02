import * as db from '@zwolf/firestore'

import { CronJob } from '../../types'

export interface FirestoreCronJob extends Omit<CronJob, 'id'> {
  createdAt: Date,
  updatedAt: Date,
  lastRunAt: Date,
  nextRunAt: Date,
}

export const FirestoreCronJobCollection = db.collection<FirestoreCronJob>(
  'zwolf_cron',
)
