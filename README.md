# zwolf-cron

A library & service for dispatching events at regular intervals.

Uses [cron expressions](https://crontab.guru/) to configure the schedule. 

## Backends

### Google Cloud Scheduler

If you are using Google Cloud PubSub this is the way to go.

### Google Cloud Firestore

## Topics

### create

```
import { cronEvents } from '@zwolf/cron'

await dispatch(cronEvents.create.request({
  rule: '* * * * *',
  type: 'type',
  payload: {}
}))
```

### update

### destroy

```
import { cronEvents } from '@zwolf/cron'

await dispatch(cronEvents.destroy.request({
  id: 'id'
}))
```

## CronStore

```
import { CronStore } from '@zwolf/cron'

const cronStore = new CronStore({
})
```

### readAll()

```
const jobs = await cronStore.readAll()
```

### read( id )

```
.read(id)
.readAll()

.create()
.update()
.destroy()
```

## Environment Variables
