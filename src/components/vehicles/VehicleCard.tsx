import type { KeyboardEvent } from 'react'

export type VehicleCardProps = {
  vehicle: {
    id: string | number
    name: string
    speed: number
    messageTime?: string
    geofence?: string
    address?: string
  }
  onClick?: () => void
}

const STATUS_STYLES = {
  moving: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
  idle: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40',
  stopped: 'bg-orange-500/20 text-orange-400 border border-orange-500/40',
  offline: 'bg-red-500/20 text-red-400 border border-red-500/40',
}

function getVehicleStatus(vehicle: VehicleCardProps['vehicle']) {
  if (!vehicle.messageTime) return 'offline'
  if (vehicle.speed > 5) return 'moving'
  if (vehicle.speed > 0) return 'idle'
  return 'stopped'
}

function formatMessageTime(messageTime?: string) {
  if (!messageTime) return '—'
  const parsed = new Date(messageTime)
  if (Number.isNaN(parsed.getTime())) return messageTime
  return parsed.toLocaleTimeString()
}

export function VehicleCard({ vehicle, onClick }: VehicleCardProps) {
  const status = getVehicleStatus(vehicle)
  const badgeClass = STATUS_STYLES[status]
  const speedLabel = vehicle.speed === 0 ? 'Stopped' : `${vehicle.speed} km/h`
  const messageTime = formatMessageTime(vehicle.messageTime)
  const geofence = vehicle.geofence ?? 'Not in Any Geofence'
  const address = vehicle.address ?? '—'

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      onClick?.()
    }
  }

  return (
    <div
      role='button'
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className='cursor-pointer space-y-2 rounded-2xl border border-slate-700 bg-gradient-to-r from-slate-900 to-slate-800 p-5 shadow-md transition hover:shadow-lg'
    >
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-white'>{vehicle.name}</h3>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${badgeClass}`}>{status.toUpperCase()}</span>
      </div>

      <div className='text-sm text-gray-400'>
        Message Time: <span className='text-gray-200'>{messageTime}</span>
      </div>
      <div className='text-sm text-gray-400'>
        Geofence: <span className='text-cyan-400'>{geofence}</span>
      </div>
      <div className='text-sm text-gray-400'>
        Address: <span className='text-gray-200'>{address}</span>
      </div>
      <div className='text-sm text-gray-400'>
        Speed: <span className='text-gray-200'>{speedLabel}</span>
      </div>
    </div>
  )
}
