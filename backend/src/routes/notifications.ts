import { Router } from 'express'
import { supabaseAdmin } from '../db/supabase'

const router = Router()

// Get notifications for user
router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const decoded = (await import('jsonwebtoken')).verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret'
    ) as any

    const { data: notifications, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('user_id', decoded.userId)
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch notifications' })
    }

    res.json({ notifications })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create notification
router.post('/', async (req, res) => {
  try {
    const { userId, type, title, message, data } = req.body

    const { data: notification, error } = await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        data,
        created_at: new Date().toISOString(),
      })
      .select('*')
      .single()

    if (error) {
      return res.status(500).json({ error: 'Failed to create notification' })
    }

    res.json({ notification })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Mark notification as read
router.patch('/:id/read', async (req, res) => {
  try {
    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ read: true })
      .eq('id', req.params.id)

    if (error) {
      return res.status(500).json({ error: 'Failed to mark notification as read' })
    }

    res.json({ message: 'Notification marked as read' })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Mark all notifications as read
router.patch('/user/:userId/read-all', async (req, res) => {
  try {
    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ read: true })
      .eq('user_id', req.params.userId)

    if (error) {
      return res.status(500).json({ error: 'Failed to mark notifications as read' })
    }

    res.json({ message: 'All notifications marked as read' })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})