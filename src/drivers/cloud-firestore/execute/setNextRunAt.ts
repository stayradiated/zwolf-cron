import * as db from '@zwolf/firestore'

import { FirestoreCronJobCollection } from '../firestore'

import calculateNextRunAt from './calculateNextRunAt'

const setNextRunAt = async (): Promise<void> => {
  const allRows = await db.all(FirestoreCronJobCollection)

  const rowsToUpdate = allRows.filter((row) => {
    const { lastRunAt, nextRunAt } = row.data
    return lastRunAt >= nextRunAt || nextRunAt == null
  })

  for (const row of rowsToUpdate) {
    await db.transaction(
      ({ get }) => get(FirestoreCronJobCollection, row.ref.id),
      ({ data: job, update }) => {
        const nextRunAt = calculateNextRunAt({ schedule: job.data.schedule })
        return update(job.ref, { nextRunAt, updatedAt: db.value('serverDate') })
      },
    )
  }
}

export default setNextRunAt
