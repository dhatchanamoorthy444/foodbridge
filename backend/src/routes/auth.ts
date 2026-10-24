import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { supabaseAdmin } from '../db/supabase'

const router = Router()

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
  role: z.enum(['donor', 'recipient', 'admin', 'volunteer']),
  organization: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body)

    // Check if user exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', validatedData.email)
      .single()

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Create user
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert({
        email: validatedData.email,
        password_hash: hashedPassword,
        full_name: validatedData.fullName,
        role: validatedData.role,
        organization: validatedData.organization,
      })
      .select('id, email, full_name, role')
      .single()

    if (error) {
      return res.status(500).json({ error: 'Failed to create user' })
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    )

    res.json({ token, user })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors })
    }
  }
})

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body)

    // Get user
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, full_name, role, password_hash')
      .eq('email', validatedData.email)
      .single()

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Verify password
    const isValid = await bcrypt.compare(validatedData.password, user.password_hash)
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    )

    // Remove password from response
    const { password_hash, ...userData } = user

    res.json({ token, user: userData })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors })
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// Get current user endpoint
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, full_name, role, organization')
      .eq('id', decoded.userId)
      .single()

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ user })
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
})