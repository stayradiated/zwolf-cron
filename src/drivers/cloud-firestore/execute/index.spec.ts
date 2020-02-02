import * as db from '@zwolf/firestore'
import test from 'ava'
import sinon from 'sinon'

import { execute } from './index'
import { FirestoreCronJob, FirestoreCronJobCollection } from '../firestore'

const DISTANT_PAST = new Date('1994-02-15')
const PAST = new Date('2018-02-15')

const CRON_JOB_DEFAULTS: FirestoreCronJob = {
  schedule: '* * * * *',
  type: 'test',
  payload: { hello: 'world' },
  createdAt: db.value('serverDate'),
  updatedAt: db.value('serverDate'),
  lastRunAt: null,
  nextRunAt: null,
}

test.beforeEach(async (t) => {
  const docs = await db.all(FirestoreCronJobCollection)
  for (const doc of docs) {
    await db.remove(doc.ref)
  }
})

test('(lastRunAt=NULL, nextRunAt=NULL) set nextRunAt', async (t) => {
  const now = new Date()

  const job = await db.add(FirestoreCronJobCollection, {
    ...CRON_JOB_DEFAULTS,
    lastRunAt: null,
    nextRunAt: null,
  })

  const dispatch = sinon.stub()

  await Promise.all([execute(dispatch)])

  const updatedJob = await db.get(job.ref)

  t.deepEqual(dispatch.callCount, 0)
  t.is(updatedJob.data.lastRunAt, null)
  t.true(updatedJob.data.nextRunAt > now)
})

test('(lastRunAt=PAST,nextRunAt=PAST) do nothing', async (t) => {
  const now = new Date()

  const job = await db.add(FirestoreCronJobCollection, {
    ...CRON_JOB_DEFAULTS,
    lastRunAt: PAST,
    nextRunAt: PAST,
  })

  const dispatch = sinon.stub()

  await Promise.all([execute(dispatch)])

  const updatedJob = await db.get(job.ref)

  t.is(dispatch.callCount, 0)
  t.deepEqual(updatedJob.data.lastRunAt, PAST)
  t.true(updatedJob.data.nextRunAt > now)
})

test('(lastRunAt=DISTANT_PAST,nextRunAt=PAST) fire once', async (t) => {
  const now = new Date()

  const job = await db.add(FirestoreCronJobCollection, {
    ...CRON_JOB_DEFAULTS,
    lastRunAt: DISTANT_PAST,
    nextRunAt: PAST,
  })

  const dispatch = sinon.stub()

  await Promise.all([execute(dispatch)])

  const updatedJob = await db.get(job.ref)

  t.is(dispatch.callCount, 1)
  t.true(updatedJob.data.lastRunAt > now)
  t.true(updatedJob.data.nextRunAt > now)

  t.deepEqual(dispatch.args[0], [
    {
      type: 'test',
      payload: { hello: 'world' },
    },
  ])
})
