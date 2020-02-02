import * as db from '@zwolf/firestore'

import { FirestoreCronJob, FirestoreCronJobCollection } from '../firestore'

const setLastRunAt = async (): Promise<FirestoreCronJob[]> => {
  const allRows = await db.query(FirestoreCronJobCollection, [
    db.where('nextRunAt', '<=', new Date()),
  ])

  const rowsToUpdate = allRows.filter((row) => {
    const { lastRunAt, nextRunAt } = row.data
    return lastRunAt < nextRunAt || lastRunAt == null
  })

  for (const row of rowsToUpdate) {
    await db.transaction(
      ({ get }) => get(FirestoreCronJobCollection, row.ref.id),
      ({ data: job, update }) => {
        return update(job.ref, {
          lastRunAt: db.value('serverDate'),
          updatedAt: db.value('serverDate'),
        })
      },
    )
  }

  return rowsToUpdate.map((doc) => doc.data)
}

export default setLastRunAt
