import { FiPauseCircle, FiPlayCircle, FiTool, FiTruck, FiWifiOff } from 'react-icons/fi'
import { VehicleActivityBarChart } from '@components/charts/VehicleActivityBarChart'
import { VehicleStatusPieChart } from '@components/charts/VehicleStatusPieChart'
import { RecentActivities } from '@components/dashboard/RecentActivities'
import { DashboardLayout } from '@components/layout/DashboardLayout'
import { StatCard } from '@components/ui/StatCard'
import { WelcomeCard } from '@components/ui/WelcomeCard'
import { useAuthStore } from '@store/authStore'
import { useNavigate } from 'react-router-dom'

export function DashboardPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const role = useAuthStore((state) => state.role)

  return (
    <DashboardLayout>
      <div className='mx-auto w-full max-w-7xl space-y-5'>
        <WelcomeCard name={user?.name ?? 'Operator'} role={role ?? 'NO_ROLE'} />

        <section className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5'>
          <button type='button' onClick={() => navigate('/vehicles')} className='text-left'>
            <StatCard title='Total Vehicles' value={128} icon={<FiTruck size={18} />} color='blue' trend='+6 this week' />
          </button>
          <button type='button' onClick={() => navigate('/vehicles?status=moving')} className='text-left'>
            <StatCard title='Moving' value={64} icon={<FiPlayCircle size={18} />} color='emerald' trend='50% active' />
          </button>
          <button type='button' onClick={() => navigate('/vehicles?status=idling')} className='text-left'>
            <StatCard title='Idling' value={22} icon={<FiPauseCircle size={18} />} color='amber' trend='12 high idle' />
          </button>
          <button type='button' onClick={() => navigate('/vehicles?status=offline')} className='text-left'>
            <StatCard title='Offline' value={35} icon={<FiWifiOff size={18} />} color='rose' trend='Needs attention' />
          </button>
          <button type='button' onClick={() => navigate('/vehicles?status=maintenance')} className='text-left'>
            <StatCard title='Maintenance' value={7} icon={<FiTool size={18} />} color='violet' trend='2 due today' />
          </button>
        </section>

        <section className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
          <VehicleStatusPieChart />
          <VehicleActivityBarChart />
        </section>

        <RecentActivities />
      </div>
    </DashboardLayout>
  )
}
