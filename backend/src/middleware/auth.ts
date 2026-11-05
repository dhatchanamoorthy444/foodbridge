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
      // Auto-create the missing profiles row server-side (service role bypasses RLS).
      // Some sign-up flows (email confirmation, missing DB trigger) leave the
      // profiles table empty even though the auth session is valid.
      const meta = (authUser.user_metadata as Record<string, unknown> | undefined) ?? {}
      const role = (meta.role as AppRole) ?? 'recipient'
      const { data: created, error: createError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: authUser.id,
          email: authUser.email ?? null,
          role,
          full_name: meta.full_name ?? null,
          organization: meta.organization ?? null,
          phone: meta.phone ?? null,
          account_type: meta.account_type ?? null,
          city: meta.city ?? null,
        })
        .select('id, email, role, full_name, organization, phone, account_type, city')
        .single()

      if (createError || !created) {
        console.error('[authMiddleware] auto-create profile failed', createError)
        return res
          .status(401)
          .json({ error: 'Profile not found. Complete registration first.' })
      }

      req.user = {
        userId: authUser.id,
        email: authUser.email ?? created.email,
        role: (created.role as AppRole) ?? 'recipient',
        profile: created as Profile,
      }
    } else {
      req.user = {
        userId: authUser.id,
        email: authUser.email ?? profile.email,
        role: (profile.role as AppRole) ?? 'recipient',
        profile: profile as Profile,
      }
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