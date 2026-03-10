import { useEffect, useState } from 'react'

type RoleOption = 'SUPER_ADMIN' | 'COLLEGE_ADMIN' | 'FLEET_MANAGER' | 'STUDENT'

type CollegeOption = {
  id: string
  name: string
}

export type CreateUserPayload = {
  name: string
  email: string
  password: string
  role: RoleOption
  collegeId?: string
}

type AddUserModalProps = {
  isOpen: boolean
  onClose: () => void
  onCreate?: (payload: CreateUserPayload) => Promise<void> | void
  colleges?: CollegeOption[]
}

const DEFAULT_COLLEGES: CollegeOption[] = [
  { id: 'COLLEGE_001', name: 'College 001' },
  { id: 'COLLEGE_002', name: 'College 002' },
  { id: 'COLLEGE_003', name: 'College 003' },
]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function AddUserModal({ isOpen, onClose, onCreate, colleges = DEFAULT_COLLEGES }: AddUserModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<RoleOption>('SUPER_ADMIN')
  const [collegeId, setCollegeId] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      return
    }
    setName('')
    setEmail('')
    setPassword('')
    setRole('SUPER_ADMIN')
    setCollegeId('')
    setError('')
    setIsSaving(false)
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  const handleCreate = async () => {
    setError('')

    if (!name.trim()) {
      setError('Name is required.')
      return
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      setError('Enter a valid email address.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setIsSaving(true)
    try {
      await onCreate?.({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        collegeId: collegeId || undefined,
      })
      onClose()
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Failed to create user.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4'>
      <div className='w-full max-w-lg rounded-2xl border border-white/30 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-[#1e293b]'>
        <div className='mb-4'>
          <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>Add User</h3>
          <p className='text-sm text-slate-600 dark:text-slate-300'>Create a new platform user</p>
        </div>

        <div className='space-y-3'>
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
              type='email'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className='w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-100 dark:focus:border-[#38bdf8]'
            />
          </label>

          <label className='space-y-1'>
            <span className='text-sm font-medium text-slate-700 dark:text-slate-200'>Password</span>
            <input
              type='password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className='w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-100 dark:focus:border-[#38bdf8]'
            />
          </label>

          <label className='space-y-1'>
            <span className='text-sm font-medium text-slate-700 dark:text-slate-200'>Role</span>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as RoleOption)}
              className='w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-100 dark:focus:border-[#38bdf8]'
            >
              <option value='SUPER_ADMIN'>SUPER_ADMIN</option>
              <option value='COLLEGE_ADMIN'>COLLEGE_ADMIN</option>
              <option value='FLEET_MANAGER'>FLEET_MANAGER</option>
              <option value='STUDENT'>STUDENT</option>
            </select>
          </label>

          <label className='space-y-1'>
            <span className='text-sm font-medium text-slate-700 dark:text-slate-200'>College</span>
            <select
              value={collegeId}
              onChange={(event) => setCollegeId(event.target.value)}
              className='w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-100 dark:focus:border-[#38bdf8]'
            >
              <option value=''>Select college</option>
              {colleges.map((college) => (
                <option key={college.id} value={college.id}>
                  {college.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error ? <p className='mt-3 text-sm text-rose-600 dark:text-rose-300'>{error}</p> : null}

        <div className='mt-5 flex flex-wrap justify-end gap-2'>
          <button
            type='button'
            onClick={onClose}
            className='rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-600 hover:text-blue-600 dark:border-slate-600 dark:text-slate-100 dark:hover:border-[#38bdf8] dark:hover:text-[#38bdf8]'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={handleCreate}
            disabled={isSaving}
            className='rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#38bdf8] dark:text-slate-950 dark:hover:bg-cyan-300'
          >
            {isSaving ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </div>
    </div>
  )
}
