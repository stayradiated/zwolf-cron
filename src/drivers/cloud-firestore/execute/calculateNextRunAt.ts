import parser from 'cron-parser'

interface Options {
  schedule: string,
}

const calculateNextRunAt = (options: Options) => {
  const { schedule } = options

  const interval = parser.parseExpression(schedule)

  return interval.next().toDate()
}

export default calculateNextRunAt
