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

    // 1. Verify the Supabase access token
    const { data, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !data?.user) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    const authUser = data.user
    const authUserId = authUser.id

    // Log the authenticated UUID for debugging (never log the token)
    console.log(
      `[authMiddleware] authenticated userId=${authUserId} email=${authUser.email ?? 'null'}`
    )

    // 2. Look up the profiles row for this authenticated user
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, role, full_name, organization, phone, account_type, city')
      .eq('id', authUserId)
      .maybeSingle()

    if (profileError) {
      console.error(
        `[authMiddleware] profile lookup error for userId=${authUserId}:`,
        profileError
      )
      return res.status(500).json({
        error: 'Unable to retrieve profile',
        detail: profileError.message,
      })
    }

    if (!profile) {
      // Profile missing — auto-create idempotently using service role (bypasses RLS)
      console.log(
        `[authMiddleware] profile missing for userId=${authUserId}, auto-creating...`
      )

      const meta = (authUser.user_metadata as Record<string, unknown> | undefined) ?? {}
      const role = (meta.role as AppRole) ?? 'recipient'

      const { data: created, error: createError } = await supabaseAdmin
        .from('profiles')
        .upsert(
          {
            id: authUserId,
            email: authUser.email ?? null,
            role,
            full_name: meta.full_name ?? null,
            organization: meta.organization ?? null,
            phone: meta.phone ?? null,
            account_type: meta.account_type ?? null,
            city: meta.city ?? null,
          },
          { onConflict: 'id' }
        )
        .select('id, email, role, full_name, organization, phone, account_type, city')
        .single()

      if (createError || !created) {
        console.error(
          `[authMiddleware] auto-create profile failed for userId=${authUserId}:`,
          createError
        )
        return res.status(401).json({
          error: 'Profile not found. Complete registration first.',
          detail: createError?.message ?? 'profile row could not be created',
          userId: authUserId,
        })
      }

      req.user = {
        userId: authUserId,
        email: authUser.email ?? created.email,
        role: (created.role as AppRole) ?? 'recipient',
        profile: created as Profile,
      }
    } else {
      req.user = {
        userId: authUserId,
        email: authUser.email ?? profile.email,
        role: (profile.role as AppRole) ?? 'recipient',
        profile: profile as Profile,
      }
    }

    next()
  } catch (err) {
    console.error('[authMiddleware] unexpected error:', err)
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
