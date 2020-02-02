import { DispatchFn } from '@zwolf/turbine'

import setLastRunAt from './setLastRunAt'
import setNextRunAt from './setNextRunAt'

const execute = async (dispatch: DispatchFn) => {
  await setNextRunAt()
  const jobs = await setLastRunAt()
  await setNextRunAt()

  for (const job of jobs) {
    await dispatch({
      type: job.type,
      payload: job.payload,
    })
  }
}

export { execute }
