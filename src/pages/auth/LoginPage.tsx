import { useMemo, useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'

type ExampleAccount = {
  label: string
  email: string
  password: string
}

const exampleAccounts: ExampleAccount[] = [
  { label: 'Super Admin', email: 'admin@vts.local', password: 'admin123' },
  { label: 'College Admin', email: 'college@vts.local', password: 'admin123' },
  { label: 'Fleet Manager', email: 'fleet@vts.local', password: 'admin123' },
  { label: 'Student', email: 'student@vts.local', password: 'student123' },
]

export function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const canSubmit = useMemo(
    () => Boolean(email.trim()) && Boolean(password.trim()) && !isLoading,
    [email, password, isLoading],
  )

  if (isAuthenticated) {
    return <Navigate to='/dashboard' replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
      navigate('/dashboard', { replace: true })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className='relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 text-slate-100'>
      <div className='pointer-events-none absolute inset-0'>
        <div className='absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-cyan-400/30 blur-3xl animate-pulse' />
        <div className='absolute bottom-[-8rem] right-[-8rem] h-80 w-80 rounded-full bg-blue-600/30 blur-3xl animate-pulse [animation-delay:450ms]' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_40%)]' />
      </div>

      <div className='relative z-10 w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8'>
        <h1 className='text-2xl font-semibold tracking-tight sm:text-3xl'>VTS Platform Login</h1>
        <p className='mt-2 text-sm text-slate-300'>Sign in to access the vehicle tracking dashboard.</p>

        <form className='mt-6 space-y-4' onSubmit={handleSubmit}>
          <label className='block space-y-2'>
            <span className='text-sm font-medium text-slate-200'>Email</span>
            <input
              type='email'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder='you@vts.local'
              autoComplete='email'
              className='w-full rounded-xl border border-white/25 bg-slate-900/50 px-4 py-3 text-sm text-white outline-none transition focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/40'
            />
          </label>

          <label className='block space-y-2'>
            <span className='text-sm font-medium text-slate-200'>Password</span>
            <input
              type='password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder='Enter your password'
              autoComplete='current-password'
              className='w-full rounded-xl border border-white/25 bg-slate-900/50 px-4 py-3 text-sm text-white outline-none transition focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/40'
            />
          </label>

          {error ? (
            <p className='rounded-lg border border-red-400/50 bg-red-500/10 px-3 py-2 text-sm text-red-200'>{error}</p>
          ) : null}

          <button
            type='submit'
            disabled={!canSubmit}
            className='w-full rounded-xl bg-[#38bdf8] px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70'
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className='mt-6 border-t border-white/15 pt-4'>
          <h2 className='text-sm font-medium text-slate-200'>Example Accounts</h2>
          <ul className='mt-3 space-y-2 text-xs text-slate-300'>
            {exampleAccounts.map((account) => (
              <li
                key={account.email}
                className='rounded-lg border border-white/10 bg-slate-900/35 px-3 py-2'
              >
                <p className='font-semibold text-slate-100'>{account.label}</p>
                <p>
                  {account.email} / {account.password}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}
