import { FiMapPin, FiPlayCircle, FiSquare, FiTrendingUp } from 'react-icons/fi'
import type { IconType } from 'react-icons'

type ActivityType =
  | 'Vehicle started moving'
  | 'Vehicle entered geofence'
  | 'Overspeed detected'
  | 'Vehicle stopped'

type ActivityItem = {
  id: string
  vehicleName: string
  activityType: ActivityType
  timestamp: string
}

const activityIconMap: Record<ActivityType, IconType> = {
  'Vehicle started moving': FiPlayCircle,
  'Vehicle entered geofence': FiMapPin,
  'Overspeed detected': FiTrendingUp,
  'Vehicle stopped': FiSquare,
}

const mockActivities: ActivityItem[] = [
  { id: 'act-1', vehicleName: 'VTS Vehicle 01', activityType: 'Vehicle started moving', timestamp: '2 min ago' },
  { id: 'act-2', vehicleName: 'VTS Vehicle 03', activityType: 'Vehicle entered geofence', timestamp: '5 min ago' },
  { id: 'act-3', vehicleName: 'VTS Vehicle 07', activityType: 'Overspeed detected', timestamp: '8 min ago' },
  { id: 'act-4', vehicleName: 'VTS Vehicle 05', activityType: 'Vehicle stopped', timestamp: '12 min ago' },
  { id: 'act-5', vehicleName: 'VTS Vehicle 10', activityType: 'Vehicle started moving', timestamp: '18 min ago' },
  { id: 'act-6', vehicleName: 'VTS Vehicle 02', activityType: 'Vehicle entered geofence', timestamp: '24 min ago' },
  { id: 'act-7', vehicleName: 'VTS Vehicle 06', activityType: 'Overspeed detected', timestamp: '31 min ago' },
  { id: 'act-8', vehicleName: 'VTS Vehicle 04', activityType: 'Vehicle stopped', timestamp: '42 min ago' },
  { id: 'act-9', vehicleName: 'VTS Vehicle 08', activityType: 'Vehicle started moving', timestamp: '51 min ago' },
  { id: 'act-10', vehicleName: 'VTS Vehicle 09', activityType: 'Vehicle entered geofence', timestamp: '1 hr ago' },
]

type RecentActivitiesProps = {
  items?: ActivityItem[]
}

export function RecentActivities({ items = mockActivities }: RecentActivitiesProps) {
  const activities = items.slice(0, 10)

  return (
    <section className='rounded-2xl border border-white/30 bg-white/55 p-5 shadow-lg shadow-slate-900/5 backdrop-blur-xl dark:border-slate-700/70 dark:bg-[#1e293b]/70 dark:shadow-black/20'>
      <header className='mb-4'>
        <h2 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>Recent Activities</h2>
        <p className='text-sm text-slate-600 dark:text-slate-300'>Latest vehicle events (max 10)</p>
      </header>

      <ol className='relative ml-3 border-l border-slate-300 dark:border-slate-600'>
        {activities.map((activity) => {
          const Icon = activityIconMap[activity.activityType]

          return (
            <li key={activity.id} className='relative mb-4 ml-4 last:mb-0'>
              <span className='absolute -left-[1.46rem] top-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-blue-600 dark:border-slate-600 dark:bg-slate-900 dark:text-[#38bdf8]'>
                <Icon size={14} />
              </span>

              <div className='rounded-xl border border-slate-200/70 bg-white/70 p-3 dark:border-slate-700 dark:bg-slate-900/40'>
                <p className='text-sm font-semibold text-slate-900 dark:text-slate-100'>{activity.vehicleName}</p>
                <p className='text-sm text-slate-700 dark:text-slate-200'>{activity.activityType}</p>
                <p className='mt-1 text-xs text-slate-500 dark:text-slate-400'>{activity.timestamp}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
