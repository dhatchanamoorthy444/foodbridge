import { Request, Response, NextFunction } from 'express'
import { supabaseAdmin } from '../db/supabase'

export type AppRole = 'donor' | 'recipient' | 'admin' | 'volunteer'

export interface Profile {
  id: string
  email: string
  role: string
  full_name: string | null
  organization: string | null
  phone: string | null
  account_type: string | null
  city: string | null
}

export interface AuthUser {
  userId: string
  email: string
  role: AppRole
  profile: Profile
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}

/**
 * Verifies a Supabase access token and loads the caller's profile.
 * Role is always read server-side from `profiles` — never from the request.
 * Falls back to accepting legacy JWTs is intentionally NOT supported:
 * the legacy `users` table does not exist in this Supabase project.
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token || token === 'null') {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const { data, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !data?.user) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    const authUser = data.user
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, role, full_name, organization, phone, account_type, city')
      .eq('id', authUser.id)
      .single()

    if (profileError || !profile) {
      return res
        .status(401)
        .json({ error: 'Profile not found. Complete registration first.' })
    }

    req.user = {
      userId: authUser.id,
      email: authUser.email ?? profile.email,
      role: (profile.role as AppRole) ?? 'recipient',
      profile: profile as Profile,
    }
    next()
  } catch (err) {
    next(err)
  }
}

export function requireRole(...roles: AppRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }
    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: `Requires role: ${roles.join(' or ')}` })
    }
    next()
  }
}

export const requireDonor = requireRole('donor')
export const requireRecipient = requireRole('recipient')
export const requireStaff = requireRole('admin', 'volunteer')