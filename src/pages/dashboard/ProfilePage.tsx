import { useEffect, useState } from 'react'
import { ProfileInfoCard } from '@components/profile/ProfileInfoCard'
import { ChangePasswordForm } from '@components/profile/ChangePasswordForm'
import { PreferencesCard } from '@components/profile/PreferencesCard'
import type { NotificationPreferences, UserProfile } from '../../types/profile'
import { profileService } from '@services/profileService'
import { useAuthStore } from '@store/authStore'

export function ProfilePage() {
  const authUser = useAuthStore((state) => state.user)
  const authRole = useAuthStore((state) => state.role)

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)
  const [timezone, setTimezone] = useState('Asia/Kolkata')

  useEffect(() => {
    const loadPreferences = async () => {
      const prefs = await profileService.getPreferences()
      setPreferences(prefs.preferences)
      setTimezone(prefs.timezone)
    }

    void loadPreferences()
  }, [])

  useEffect(() => {
    if (!authUser && !authRole) return

    setProfile({
      id: 'current-user',
      name: authUser?.name ?? 'User',
      email: '',
      role: authRole ?? 'STUDENT',
      collegeId: undefined,
      timezone,
    })
  }, [authUser, authRole, timezone])

  const handleSaveProfile = async (nextProfile: UserProfile) => {
    await profileService.updateProfile({ name: nextProfile.name })
    setProfile(nextProfile)
  }

  const handleChangePassword = async (payload: { currentPassword: string; newPassword: string }) => {
    await profileService.changePassword(payload)
  }

  const handleSavePreferences = async (payload: { timezone: string; preferences: NotificationPreferences }) => {
    await profileService.updatePreferences(payload)
    setPreferences(payload.preferences)
    setTimezone(payload.timezone)
  }

  if (!profile || !preferences) {
    return <div className='mx-auto w-full max-w-7xl'>Loading profile...</div>
  }

  return (
    <div className='mx-auto w-full max-w-7xl space-y-5'>
      <section className='rounded-2xl border border-white/30 bg-white/55 p-4 shadow-lg shadow-slate-900/5 backdrop-blur-xl dark:border-slate-700/70 dark:bg-[#1e293b]/70 dark:shadow-black/20'>
        <h2 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>Profile & Preferences</h2>
        <p className='text-sm text-slate-600 dark:text-slate-300'>Manage your account settings and security</p>
      </section>

      <ProfileInfoCard profile={profile} onSave={handleSaveProfile} />

      <PreferencesCard timezone={timezone} preferences={preferences} onSave={handleSavePreferences} />

      <ChangePasswordForm onSubmit={handleChangePassword} />
    </div>
  )
}
