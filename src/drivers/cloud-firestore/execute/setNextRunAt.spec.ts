import * as db from '@zwolf/firestore'
import test from 'ava'

import { FirestoreCronJob, FirestoreCronJobCollection } from '../firestore'

import setNextRunAt from './setNextRunAt'

const CRON_JOB_DEFAULTS: FirestoreCronJob = {
  createdAt: db.value('serverDate'),
  updatedAt: db.value('serverDate'),
  schedule: '* * * * *',
  type: 'test',
  payload: {},
  lastRunAt: null,
  nextRunAt: null,
}

test('(lastRunAt=null, nextRunAt=null) set nextRunAt', async (t) => {
  const job = await db.add(FirestoreCronJobCollection, {
    ...CRON_JOB_DEFAULTS,
    lastRunAt: null,
    nextRunAt: null,
  })

  await setNextRunAt()

  const updatedJob = await db.get(job.ref)

  t.true(updatedJob.data.nextRunAt instanceof Date)
})

test('(lastRunAt=null, nextRunAt=now) nothing', async (t) => {
  const nextRunAt = new Date()

  const job = await db.add(FirestoreCronJobCollection, {
    ...CRON_JOB_DEFAULTS,
    lastRunAt: null,
    nextRunAt,
  })

  await setNextRunAt()

  const updatedJob = await db.get(job.ref)

  t.deepEqual(updatedJob.data.nextRunAt, nextRunAt)
})

test('(lastRunAt=x, nextRunAt=x) set nextRunAt', async (t) => {
  const x = new Date()

  const job = await db.add(FirestoreCronJobCollection, {
    ...CRON_JOB_DEFAULTS,
    lastRunAt: x,
    nextRunAt: x,
  })

  await setNextRunAt()

  const updatedJob = await db.get(job.ref)

  t.deepEqual(updatedJob.data.lastRunAt, x)
  t.notDeepEqual(updatedJob.data.nextRunAt, x)
})

test('(lastRunAt=x+1, nextRunAt=x) set nextRunAt', async (t) => {
  const x = new Date()
  const y = new Date()
  y.setFullYear(x.getFullYear() + 1)

  const job = await db.add(FirestoreCronJobCollection, {
    ...CRON_JOB_DEFAULTS,
    lastRunAt: y,
    nextRunAt: x,
  })

  await setNextRunAt()

  const updatedJob = await db.get(job.ref)

  t.deepEqual(updatedJob.data.lastRunAt, y)
  t.notDeepEqual(updatedJob.data.nextRunAt, x)
})
