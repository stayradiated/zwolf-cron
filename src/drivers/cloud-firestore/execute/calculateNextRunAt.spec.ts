import test from 'ava'
import tk from 'timekeeper'

import calculateNextRunAt from './calculateNextRunAt'

const NOW = new Date('2000-01-01 01:00:00')
tk.freeze(NOW)

test.serial('should parse a cron rule', (t) => {
  const result = calculateNextRunAt({ schedule: '* * * * *' })

  t.deepEqual(result, new Date('2000-01-01 01:01:00'))
})
