export type UserRole = 'donor' | 'recipient' | 'admin' | 'volunteer'

export interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
  status: UserStatus
  organization?: string
  phone?: string
  address?: string
  createdAt: Date
  lastLogin?: Date
}

export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended'