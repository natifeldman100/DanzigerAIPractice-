import type { LoginRequest, LoginResponse } from '../types/auth'

const TOKEN_KEY = 'authToken'
const USER_KEY = 'authUser'

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })
  if (!res.ok) {
    throw new Error('שם משתמש או סיסמה שגויים')
  }
  const data: LoginResponse = await res.json()
  localStorage.setItem(TOKEN_KEY, data.token)
  localStorage.setItem(USER_KEY, JSON.stringify({ id: data.id, name: data.name, rightCode: data.rightCode }))
  return data
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function isAuthenticated(): boolean {
  return getToken() !== null
}

export function getCurrentUser(): { id: number; name: string; rightCode: number } | null {
  const raw = localStorage.getItem(USER_KEY)
  return raw ? JSON.parse(raw) : null
}

export function canEdit(): boolean {
  return getCurrentUser()?.rightCode === 1
}
