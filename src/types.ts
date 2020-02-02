export interface CronJob {
  id: string,
  schedule: string,
  type: string,
  payload: Record<string, any>,
}

export interface CronStore {
  create: (job: Omit<CronJob, 'id'>) => Promise<CronJob>,
  update: (job: CronJob) => Promise<void>,
  destroy: (jobId: string) => Promise<void>,
  read: (jobId: string) => Promise<CronJob>,
  readAll: () => Promise<CronJob[]>,
}
