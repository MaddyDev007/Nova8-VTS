import { useNavigate } from 'react-router-dom'
import type { Vehicle, VehicleStatus } from '../../types/vehicle'

type VehicleCardProps = {
  vehicle: Vehicle
  detailRouteBase?: string
}

const statusStyles: Record<VehicleStatus, { dot: string; badge: string }> = {
  moving: {
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  },
  idling: {
    dot: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  },
  offline: {
    dot: 'bg-rose-500',
    badge: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
  },
  maintenance: {
    dot: 'bg-slate-500',
    badge: 'bg-slate-200 text-slate-700 dark:bg-slate-500/30 dark:text-slate-200',
  },
}

export function VehicleCard({ vehicle, detailRouteBase = '/vehicles' }: VehicleCardProps) {
  const navigate = useNavigate()
  const status = statusStyles[vehicle.status]

  const handleClick = () => {
    navigate(`${detailRouteBase}/${vehicle.id}`)
  }

  return (
    <button
      type='button'
      onClick={handleClick}
      className='group relative w-full overflow-hidden rounded-2xl border border-white/30 bg-white/55 p-4 text-left shadow-lg shadow-slate-900/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-700/70 dark:bg-[#1e293b]/70 dark:shadow-black/20'
    >
      <div className='pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100 dark:bg-[#38bdf8]/20' />

      <div className='relative'>
        <div className='flex items-start justify-between gap-3'>
          <div>
            <h3 className='text-base font-semibold text-slate-900 dark:text-slate-100'>{vehicle.vehicleName}</h3>
            <p className='text-xs text-slate-500 dark:text-slate-400'>{vehicle.registrationNumber}</p>
          </div>

          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${status.badge}`}>
            <span className={`h-2 w-2 rounded-full ${status.dot}`} />
            {vehicle.status}
          </span>
        </div>

        <div className='mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300'>
          <p>
            <span className='font-medium text-slate-800 dark:text-slate-100'>Speed:</span> {vehicle.speed} km/h
          </p>
          <p>
            <span className='font-medium text-slate-800 dark:text-slate-100'>Device:</span> {vehicle.deviceId}
          </p>
          <p className='col-span-2'>
            <span className='font-medium text-slate-800 dark:text-slate-100'>Address:</span> {vehicle.address}
          </p>
          <p className='col-span-2'>
            <span className='font-medium text-slate-800 dark:text-slate-100'>Last seen:</span>{' '}
            {new Date(vehicle.lastSeen).toLocaleString()}
          </p>
        </div>
      </div>
    </button>
  )
}
