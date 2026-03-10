import { ProfileInfoCard } from '@components/profile/ProfileInfoCard'
import { ChangePasswordForm } from '@components/profile/ChangePasswordForm'
import { PreferencesCard } from '@components/profile/PreferencesCard'
import type { NotificationPreferences, UserProfile } from '../../types/profile'

const mockProfile: UserProfile = {
  id: 'user-001',
  name: 'Super Admin',
  email: 'admin@vts.local',
  role: 'SUPER_ADMIN',
  collegeId: 'COLLEGE_001',
  timezone: 'Asia/Kolkata',
}

const mockPreferences: NotificationPreferences = {
  overspeed: true,
  idling: true,
  geofence: true,
  stop: false,
  deviceOffline: true,
}

export function ProfilePage() {
  const handleSaveProfile = async (nextProfile: UserProfile) => {
    // TODO: Replace with API call (e.g. PATCH /profile)
    console.info('Profile updated', nextProfile)
  }

  const handleChangePassword = async (payload: { currentPassword: string; newPassword: string }) => {
    // TODO: Replace with API call (e.g. POST /profile/change-password)
    console.info('Password updated', payload)
  }

  const handleSavePreferences = async (payload: { timezone: string; preferences: NotificationPreferences }) => {
    // TODO: Replace with API call (e.g. PATCH /profile/preferences)
    console.info('Preferences updated', payload)
  }

  return (
    <div className='mx-auto w-full max-w-7xl space-y-5'>
      <section className='rounded-2xl border border-white/30 bg-white/55 p-4 shadow-lg shadow-slate-900/5 backdrop-blur-xl dark:border-slate-700/70 dark:bg-[#1e293b]/70 dark:shadow-black/20'>
        <h2 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>Profile & Preferences</h2>
        <p className='text-sm text-slate-600 dark:text-slate-300'>Manage your account settings and security</p>
      </section>

      <ProfileInfoCard profile={mockProfile} onSave={handleSaveProfile} />

      <PreferencesCard
        timezone={mockProfile.timezone}
        preferences={mockPreferences}
        onSave={handleSavePreferences}
      />

      <ChangePasswordForm onSubmit={handleChangePassword} />
    </div>
  )
}
