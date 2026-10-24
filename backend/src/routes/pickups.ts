import { Router } from 'express'
import { z } from 'zod'
import { supabaseAdmin } from '../db/supabase'

const router = Router()

// Validation schemas
const schedulePickupSchema = z.object({
  matchId: z.string(),
  scheduledDate: z.string(),
  scheduledTime: z.string(),
  notes: z.string().optional(),
})

const confirmPickupSchema = z.object({
  pickupId: z.string(),
  confirmationCode: z.string(),
  actualQuantity: z.number().positive(),
  notes: z.string().optional(),
})

// Get pickups
router.get('/', async (req, res) => {
  try {
    const { data: pickups, error } = await supabaseAdmin
      .from('pickups')
      .select('*')
      .order('scheduled_date', { ascending: true })

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch pickups' })
    }

    res.json({ pickups })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Schedule pickup
router.post('/schedule', async (req, res) => {
  try {
    const validatedData = schedulePickupSchema.parse(req.body)

    // Get match
    const { data: match, error: matchError } = await supabaseAdmin
      .from('matches')
      .select('*')
      .eq('id', validatedData.matchId)
      .single()

    if (matchError || !match) {
      return res.status(404).json({ error: 'Match not found' })
    }

    // Get food item
    const { data: foodItem, error: foodError } = await supabaseAdmin
      .from('food_items')
      .select('*')
      .eq('id', match.food_item_id)
      .single()

    if (foodError || !foodItem) {
      return res.status(404).json({ error: 'Food item not found' })
    }

    // Create pickup
    const pickupCode = Math.random().toString(36).substring(2, 8).toUpperCase()

    const { data: pickup, error: pickupError } = await supabaseAdmin
      .from('pickups')
      .insert({
        match_id: validatedData.matchId,
        scheduled_date: validatedData.scheduledDate,
        scheduled_time: validatedData.scheduledTime,
        status: 'scheduled',
        notes: validatedData.notes,
        confirmation_code: pickupCode,
        created_at: new Date().toISOString(),
      })
      .select('*')
      .single()

    if (pickupError) {
      return res.status(500).json({ error: 'Failed to schedule pickup' })
    }

    res.json({ pickup })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Confirm pickup
router.post('/confirm', async (req, res) => {
  try {
    const validatedData = confirmPickupSchema.parse(req.body)

    // Get pickup
    const { data: pickup, error: pickupError } = await supabaseAdmin
      .from('pickups')
      .select('*')
      .eq('id', validatedData.pickupId)
      .single()

    if (pickupError || !pickup) {
      return res.status(404).json({ error: 'Pickup not found' })
    }

    if (pickup.status !== 'in_transit') {
      return res.status(400).json({ error: 'Pickup must be in transit to be confirmed' })
    }

    if (pickup.confirmation_code !== validatedData.confirmationCode) {
      return res.status(400).json({ error: 'Invalid confirmation code' })
    }

    // Update pickup
    const { error: updateError } = await supabaseAdmin
      .from('pickups')
      .update({
        status: 'collected',
        actual_quantity: validatedData.actualQuantity,
        confirmed_at: new Date().toISOString(),
        collected_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', validatedData.pickupId)

    if (updateError) {
      return res.status(500).json({ error: 'Failed to confirm pickup' })
    }

    // Update match status
    await supabaseAdmin
      .from('matches')
      .update({ status: 'completed' })
      .eq('id', pickup.match_id)

    res.json({ message: 'Pickup confirmed successfully' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update pickup status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = ['scheduled', 'confirmed', 'in_transit', 'delivered', 'collected', 'cancelled']

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const { data: pickup, error: pickupError } = await supabaseAdmin
      .from('pickups')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (pickupError || !pickup) {
      return res.status(404).json({ error: 'Pickup not found' })
    }

    const { error: updateError } = await supabaseAdmin
      .from('pickups')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)

    if (updateError) {
      return res.status(500).json({ error: 'Failed to update pickup' })
    }

    res.json({ message: 'Pickup status updated successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})