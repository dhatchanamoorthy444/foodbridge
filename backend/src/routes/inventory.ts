import { Router } from 'express'
import { z } from 'zod'
import { supabaseAdmin } from '../db/supabase'
import { UserRole } from '../types/user'
import { FoodCategory, StorageRequirement, Unit } from '../types/food'

const router = Router()

// Validation schemas
const foodItemSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  category: z.enum(['fruits', 'vegetables', 'dairy', 'meat', 'grains', 'canned_goods', 'baked_goods', 'beverages', 'prepared_food', 'other']),
  quantity: z.number().positive(),
  unit: z.enum(['kg', 'g', 'lb', 'oz', 'liters', 'ml', 'pieces', 'boxes', 'pallets']),
  expiryDate: z.string().refine((date) => {
    const expiry = new Date(date)
    return expiry > new Date()
  }, 'Expiry date must be in the future'),
  storageRequirement: z.enum(['room_temperature', 'refrigerated', 'frozen', 'dry_cool', 'special']),
  conditionNotes: z.string().max(1000).optional(),
})

// Get all food items (for donors/admin)
router.get('/', async (req, res) => {
  try {
    const { data: items, error } = await supabaseAdmin
      .from('food_items')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch food items' })
    }

    res.json({ items })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get food item by ID
router.get('/:id', async (req, res) => {
  try {
    const { data: item, error } = await supabaseAdmin
      .from('food_items')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error || !item) {
      return res.status(404).json({ error: 'Food item not found' })
    }

    res.json({ item })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create new food item (donor only)
router.post('/', async (req, res) => {
  try {
    const validatedData = foodItemSchema.parse(req.body)

    // Get current user
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const decoded = (await import('jsonwebtoken')).verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret'
    ) as any

    // Create food item
    const { data: item, error } = await supabaseAdmin
      .from('food_items')
      .insert({
        donor_id: decoded.userId,
        name: validatedData.name,
        description: validatedData.description,
        category: validatedData.category,
        quantity: validatedData.quantity,
        unit: validatedData.unit,
        available_quantity: validatedData.quantity,
        expiry_date: validatedData.expiryDate,
        storage_requirement: validatedData.storageRequirement,
        condition_notes: validatedData.conditionNotes,
        status: 'normal', // Will be updated based on expiry date
      })
      .select('*')
      .single()

    if (error) {
      return res.status(500).json({ error: 'Failed to create food item' })
    }

    res.status(201).json({ item })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update food item
router.put('/:id', async (req, res) => {
  try {
    const { data: existingItem } = await supabaseAdmin
      .from('food_items')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (!existingItem) {
      return res.status(404).json({ error: 'Food item not found' })
    }

    // Check if user owns the item (donor) or is admin
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const decoded = (await import('jsonwebtoken')).verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret'
    ) as any

    if (existingItem.donor_id !== decoded.userId && decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this item' })
    }

    const validatedData = foodItemSchema.partial().parse(req.body)

    // Update item
    const { data: item, error } = await supabaseAdmin
      .from('food_items')
      .update({
        name: validatedData.name,
        description: validatedData.description,
        category: validatedData.category,
        quantity: validatedData.quantity,
        unit: validatedData.unit,
        available_quantity: validatedData.availableQuantity ?? existingItem.available_quantity,
        expiry_date: validatedData.expiryDate || existingItem.expiry_date,
        storage_requirement: validatedData.storageRequirement || existingItem.storage_requirement,
        condition_notes: validatedData.conditionNotes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.params.id)
      .select('*')
      .single()

    if (error) {
      return res.status(500).json({ error: 'Failed to update food item' })
    }

    res.json({ item })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete food item (donor only)
router.delete('/:id', async (req, res) => {
  try {
    const { data: existingItem } = await supabaseAdmin
      .from('food_items')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (!existingItem) {
      return res.status(404).json({ error: 'Food item not found' })
    }

    // Check if user owns the item (donor) or is admin
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const decoded = (await import('jsonwebtoken')).verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret'
    ) as any

    if (existingItem.donor_id !== decoded.userId && decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this item' })
    }

    const { error } = await supabaseAdmin
      .from('food_items')
      .delete()
      .eq('id', req.params.id)

    if (error) {
      return res.status(500).json({ error: 'Failed to delete food item' })
    }

    res.json({ message: 'Food item deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})