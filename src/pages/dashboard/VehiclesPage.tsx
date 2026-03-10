import { useEffect, useMemo, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import { useSearchParams } from 'react-router-dom'
import { AddVehicleModal } from '@components/vehicles/AddVehicleModal'
import { VehicleTable } from '@components/vehicles/VehicleTable'
import { vehicleService } from '@services/vehicleService'
import type { Vehicle, VehicleStatus } from '../../types/vehicle'

export function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchParams] = useSearchParams()

  const initialStatusFilter = useMemo<'all' | VehicleStatus>(() => {
    const status = searchParams.get('status')
    if (!status || status === 'all') {
      return 'all'
    }
    if (status === 'moving' || status === 'idling' || status === 'offline' || status === 'maintenance') {
      return status
    }
    return 'all'
  }, [searchParams])

  const loadVehicles = async () => {
    setIsLoading(true)
    const data = await vehicleService.getVehicles()
    setVehicles(data)
    setIsLoading(false)
  }

  useEffect(() => {
    void loadVehicles()
  }, [])

  return (
    <div className='mx-auto w-full max-w-7xl space-y-5'>
      <section className='rounded-2xl border border-white/30 bg-white/55 p-4 shadow-lg shadow-slate-900/5 backdrop-blur-xl dark:border-slate-700/70 dark:bg-[#1e293b]/70 dark:shadow-black/20'>
        <div className='flex items-center justify-between gap-3'>
          <div>
            <h2 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>Vehicles</h2>
            <p className='text-sm text-slate-600 dark:text-slate-300'>Manage fleet vehicles and device assignments</p>
          </div>

          <button
            type='button'
            onClick={() => setIsAddModalOpen(true)}
            className='inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 dark:bg-[#38bdf8] dark:text-slate-950 dark:hover:bg-cyan-300'
          >
            <FiPlus size={16} />
            Add Vehicle
          </button>
        </div>
      </section>

      {isLoading ? (
        <div className='rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-600 dark:border-slate-600 dark:text-slate-300'>
          Loading vehicles...
        </div>
      ) : (
        <VehicleTable vehicles={vehicles} onVehiclesChanged={loadVehicles} initialStatusFilter={initialStatusFilter} />
      )}

      <AddVehicleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadVehicles}
      />
    </div>
  )
}
