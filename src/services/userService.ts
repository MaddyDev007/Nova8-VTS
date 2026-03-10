import type { UserRole } from './authService'

export type UserStatus = 'active' | 'disabled'

export type UserRecord = {
  id: string
  name: string
  email: string
  role: UserRole
  collegeId?: string
  status: UserStatus
  createdAt: string
}

export type CreateUserInput = {
  name: string
  email: string
  password: string
  role: UserRole
  collegeId?: string
}

export type UpdateUserInput = Partial<Omit<UserRecord, 'id' | 'email' | 'createdAt'>>

let mockUsers: UserRecord[] = [
  {
    id: 'usr-001',
    name: 'Super Admin',
    email: 'admin@vts.local',
    role: 'SUPER_ADMIN',
    collegeId: 'COLLEGE_001',
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: 'usr-002',
    name: 'College Admin',
    email: 'college@vts.local',
    role: 'COLLEGE_ADMIN',
    collegeId: 'COLLEGE_001',
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
  },
  {
    id: 'usr-003',
    name: 'Fleet Manager',
    email: 'fleet@vts.local',
    role: 'FLEET_MANAGER',
    collegeId: 'COLLEGE_002',
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
  },
  {
    id: 'usr-004',
    name: 'Student',
    email: 'student@vts.local',
    role: 'STUDENT',
    collegeId: 'COLLEGE_003',
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
]

class UserService {
  async getUsers(): Promise<UserRecord[]> {
    // TODO: Replace with REST call (e.g. GET /users)
    return mockUsers
  }

  async createUser(input: CreateUserInput): Promise<{ success: true; user: UserRecord }> {
    // TODO: Replace with REST call (e.g. POST /users)
    const newUser: UserRecord = {
      id: `usr-${Date.now()}`,
      name: input.name,
      email: input.email,
      role: input.role,
      collegeId: input.collegeId,
      status: 'active',
      createdAt: new Date().toISOString(),
    }

    mockUsers = [newUser, ...mockUsers]
    return { success: true, user: newUser }
  }

  async updateUser(userId: string, updates: UpdateUserInput): Promise<{ success: true; user: UserRecord }> {
    // TODO: Replace with REST call (e.g. PATCH /users/:id)
    const index = mockUsers.findIndex((user) => user.id === userId)
    if (index < 0) {
      throw new Error('User not found')
    }

    const current = mockUsers[index]
    const next: UserRecord = {
      ...current,
      ...updates,
      status: updates.status ?? current.status,
    }

    mockUsers = [...mockUsers.slice(0, index), next, ...mockUsers.slice(index + 1)]
    return { success: true, user: next }
  }

  async deleteUser(userId: string): Promise<{ success: true }> {
    // TODO: Replace with REST call (e.g. DELETE /users/:id)
    mockUsers = mockUsers.filter((user) => user.id !== userId)
    return { success: true }
  }

  async disableUser(userId: string): Promise<{ success: true; user: UserRecord }> {
    // TODO: Replace with REST call (e.g. PATCH /users/:id/disable)
    return this.updateUser(userId, { status: 'disabled' })
  }

  async isUserDisabled(email: string): Promise<boolean> {
    const user = mockUsers.find((item) => item.email.toLowerCase() === email.toLowerCase())
    return user ? user.status === 'disabled' : false
  }
}

export const userService = new UserService()
