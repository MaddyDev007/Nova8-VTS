import { userService } from './userService'

export type UserRole = 'SUPER_ADMIN' | 'COLLEGE_ADMIN' | 'FLEET_MANAGER' | 'STUDENT'

export type UserStatus = 'active' | 'disabled'

export type AuthUser = {
  email: string
  name: string
  role: UserRole
  status?: UserStatus
}

export type AuthSession = {
  token: string
  role: UserRole
  name: string
}

export type LoginInput = {
  email: string
  password: string
}

export interface IAuthService {
  login(email: string, password: string): Promise<AuthSession>
  logout(): void
  getCurrentUser(): AuthSession | null
}

type MockUserRecord = AuthUser & { password: string }

const SESSION_STORAGE_KEY = 'vts-auth-session'

const mockUsers: MockUserRecord[] = [
  {
    email: 'admin@vts.local',
    password: 'admin123',
    role: 'SUPER_ADMIN',
    name: 'Super Admin',
    status: 'active',
  },
  {
    email: 'college@vts.local',
    password: 'admin123',
    role: 'COLLEGE_ADMIN',
    name: 'College Admin',
    status: 'active',
  },
  {
    email: 'fleet@vts.local',
    password: 'admin123',
    role: 'FLEET_MANAGER',
    name: 'Fleet Manager',
    status: 'active',
  },
  {
    email: 'student@vts.local',
    password: 'student123',
    role: 'STUDENT',
    name: 'Student',
    status: 'active',
  },
]

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function makeMockToken(user: AuthUser): string {
  return `mock-token:${user.role}:${Date.now()}`
}

function saveSession(session: AuthSession): void {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
}

function readSession(): AuthSession | null {
  const raw = localStorage.getItem(SESSION_STORAGE_KEY)

  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AuthSession>

    if (
      typeof parsed.token === 'string' &&
      typeof parsed.role === 'string' &&
      typeof parsed.name === 'string'
    ) {
      return {
        token: parsed.token,
        role: parsed.role as UserRole,
        name: parsed.name,
      }
    }

    return null
  } catch {
    return null
  }
}

class MockAuthService implements IAuthService {
  async login(email: string, password: string): Promise<AuthSession> {
    const user = mockUsers.find(
      (candidate) =>
        candidate.email === normalizeEmail(email) && candidate.password === password,
    )

    if (!user) {
      throw new Error('Invalid email or password')
    }

    const isDisabled = user.status === 'disabled' || (await userService.isUserDisabled(user.email))
    if (isDisabled) {
      throw new Error('User account is disabled')
    }

    const session: AuthSession = {
      token: makeMockToken(user),
      role: user.role,
      name: user.name,
    }

    saveSession(session)
    return session
  }

  logout(): void {
    localStorage.removeItem(SESSION_STORAGE_KEY)
  }

  getCurrentUser(): AuthSession | null {
    return readSession()
  }
}

export const authService: IAuthService = new MockAuthService()
