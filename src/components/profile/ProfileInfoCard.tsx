import { useEffect, useState } from 'react'
import type { UserProfile } from '../../types/profile'

type ProfileInfoCardProps = {
  profile: UserProfile
  onSave?: (nextProfile: UserProfile) => Promise<void> | void
}

export function ProfileInfoCard({ profile, onSave }: ProfileInfoCardProps) {
  const [name, setName] = useState(profile.name)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setName(profile.name)
    setMessage('')
    setError('')
  }, [profile])

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Name is required.')
      return
    }

    setIsSaving(true)
    setMessage('')
    setError('')
    try {
      await onSave?.({ ...profile, name: name.trim() })
      setMessage('Profile updated.')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to update profile.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setName(profile.name)
    setMessage('')
    setError('')
  }

  return (
    <section className='rounded-2xl border border-white/30 bg-white/55 p-5 shadow-lg shadow-slate-900/5 backdrop-blur-xl dark:border-slate-700/70 dark:bg-[#1e293b]/70 dark:shadow-black/20'>
      <div className='mb-4'>
        <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>Profile Details</h3>
        <p className='text-sm text-slate-600 dark:text-slate-300'>Manage your account information</p>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <label className='space-y-1'>
          <span className='text-sm font-medium text-slate-700 dark:text-slate-200'>Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className='w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-100 dark:focus:border-[#38bdf8]'
          />
        </label>

        <label className='space-y-1'>
          <span className='text-sm font-medium text-slate-700 dark:text-slate-200'>Email</span>
          <input
            value={profile.email}
            readOnly
            className='w-full rounded-xl border border-slate-200 bg-slate-100/80 px-3 py-2 text-sm text-slate-600 outline-none dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-300'
          />
        </label>

        <label className='space-y-1'>
          <span className='text-sm font-medium text-slate-700 dark:text-slate-200'>Role</span>
          <input
            value={profile.role}
            readOnly
            className='w-full rounded-xl border border-slate-200 bg-slate-100/80 px-3 py-2 text-sm text-slate-600 outline-none dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-300'
          />
        </label>

        <label className='space-y-1'>
          <span className='text-sm font-medium text-slate-700 dark:text-slate-200'>College ID</span>
          <input
            value={profile.collegeId ?? 'Not assigned'}
            readOnly
            className='w-full rounded-xl border border-slate-200 bg-slate-100/80 px-3 py-2 text-sm text-slate-600 outline-none dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-300'
          />
        </label>
      </div>

      {message ? <p className='mt-3 text-sm text-emerald-600 dark:text-emerald-300'>{message}</p> : null}
      {error ? <p className='mt-3 text-sm text-rose-600 dark:text-rose-300'>{error}</p> : null}

      <div className='mt-4 flex flex-wrap justify-end gap-2'>
        <button
          type='button'
          onClick={handleCancel}
          className='rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-600 hover:text-blue-600 dark:border-slate-600 dark:text-slate-100 dark:hover:border-[#38bdf8] dark:hover:text-[#38bdf8]'
        >
          Cancel
        </button>
        <button
          type='button'
          onClick={handleSave}
          disabled={isSaving}
          className='rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#38bdf8] dark:text-slate-950 dark:hover:bg-cyan-300'
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </section>
  )
}
