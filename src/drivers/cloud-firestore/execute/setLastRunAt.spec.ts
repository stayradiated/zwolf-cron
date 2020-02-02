import * as db from '@zwolf/firestore'
import test from 'ava'

import { FirestoreCronJob, FirestoreCronJobCollection } from '../firestore'

import setLastRunAt from './setLastRunAt'

const DISTANT_PAST = new Date('1994-02-15')
const PAST = new Date('2018-02-15')
const FUTURE = new Date('2034-02-15')

const CRON_JOB_DEFAULTS: FirestoreCronJob = {
  createdAt: db.value('serverDate'),
  updatedAt: db.value('serverDate'),
  schedule: '* * * * *',
  type: 'test',
  payload: {},
  lastRunAt: null,
  nextRunAt: null,
}

test('(lastRunAt=NULL, nextRunAt=PAST) set lastRunAt', async (t) => {
  const job = await db.add(FirestoreCronJobCollection, {
    ...CRON_JOB_DEFAULTS,
    lastRunAt: null,
    nextRunAt: PAST,
  })

  await setLastRunAt()

  const updatedJob = await db.get(job.ref)

  t.true(updatedJob.data.lastRunAt instanceof Date)
})

test('(lastRunAt=DISTANT_PAST, nextRunAt=PAST) set lastRunAt', async (t) => {
  const job = await db.add(FirestoreCronJobCollection, {
    ...CRON_JOB_DEFAULTS,
    lastRunAt: DISTANT_PAST,
    nextRunAt: PAST,
  })

  await setLastRunAt()

  const updatedJob = await db.get(job.ref)

  t.notDeepEqual(updatedJob.data.lastRunAt, DISTANT_PAST)
  t.notDeepEqual(updatedJob.data.lastRunAt, PAST)
  t.true(updatedJob.data.lastRunAt instanceof Date)
})

test('(lastRunAt=PAST, nextRunAt=PAST) do nothing', async (t) => {
  const job = await db.add(FirestoreCronJobCollection, {
    ...CRON_JOB_DEFAULTS,
    lastRunAt: PAST,
    nextRunAt: PAST,
  })

  await setLastRunAt()

  const updatedJob = await db.get(job.ref)

  t.deepEqual(updatedJob.data.lastRunAt, PAST)
})

test('(lastRunAt=PAST, nextRunAt=FUTURE) do nothing', async (t) => {
  const job = await db.add(FirestoreCronJobCollection, {
    ...CRON_JOB_DEFAULTS,
    lastRunAt: PAST,
    nextRunAt: FUTURE,
  })

  await setLastRunAt()

  const updatedJob = await db.get(job.ref)

  t.deepEqual(updatedJob.data.lastRunAt, PAST)
})

test('(lastRunAt=FUTURE, nextRunAt=PAST) do nothing', async (t) => {
  const job = await db.add(FirestoreCronJobCollection, {
    ...CRON_JOB_DEFAULTS,
    lastRunAt: FUTURE,
  })

  await setLastRunAt()

  const updatedJob = await db.get(job.ref)

  t.deepEqual(updatedJob.data.lastRunAt, FUTURE)
})

test('(lastRunAt=DISTANT_PAST, nextRunAt=NULL) do nothing', async (t) => {
  const job = await db.add(FirestoreCronJobCollection, {
    ...CRON_JOB_DEFAULTS,
    lastRunAt: FUTURE,
    nextRunAt: null,
  })

  await setLastRunAt()

  const updatedJob = await db.get(job.ref)

  t.deepEqual(updatedJob.data.lastRunAt, FUTURE)
})
