import { Router } from 'express'
import { supabaseAdmin } from '../db/supabase'

const router = Router()

// Get dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    // Get total donations
    const { count: totalDonations } = await supabaseAdmin
      .from('food_items')
      .select('*', { count: 'exact', head: true })

    // Get redistributed items
    const { count: totalRedistributed } = await supabaseAdmin
      .from('matches')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')

    // Get active donors (users with role donor)
    const { count: activeDonors } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'donor')
      .eq('status', 'active')

    // Get active recipients
    const { count: activeRecipients } = await supabaseAdmin
      .from('recipients')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'eligible')

    // Get upcoming expirations (next 7 days)
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

    const { count: upcomingExpirations } = await supabaseAdmin
      .from('food_items')
      .select('*', { count: 'exact', head: true })
      .lt('expiry_date', sevenDaysFromNow.toISOString())
      .gt('expiry_date', new Date().toISOString())
      .eq('status', 'urgent')

    // Get pending pickups
    const { count: pendingPickups } = await supabaseAdmin
      .from('pickups')
      .select('*', { count: 'exact', head: true })
      .in('status', ['scheduled', 'confirmed', 'in_transit'])

    // Calculate completion rate
    const { count: totalMatches } = await supabaseAdmin
      .from('matches')
      .select('*', { count: 'exact', head: true })

    const { count: completedMatches } = await supabaseAdmin
      .from('matches')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')

    const completionRate = totalMatches > 0 ? ((completedMatches / totalMatches) * 100).toFixed(1) : '0'

    // Calculate food waste prevented (kg)
    const { data: matchDetails } = await supabaseAdmin
      .from('matches')
      .select('allocated_quantity, food_item_id')

    let foodWastePrevented = 0
    if (matchDetails) {
      for (const match of matchDetails) {
        const { data: foodItem } = await supabaseAdmin
          .from('food_items')
          .select('unit')
          .eq('id', match.food_item_id)
          .single()

        if (foodItem?.unit === 'kg') {
          foodWastePrevented += match.allocated_quantity
        } else if (foodItem?.unit === 'pieces') {
          // Approximate 0.5kg per piece for calculation
          foodWastePrevented += match.allocated_quantity * 0.5
        }
      }
    }

    const dashboardStats = {
      totalDonations: totalDonations || 0,
      totalRedistributed: totalRedistributed || 0,
      activeDonors: activeDonors || 0,
      activeRecipients: activeRecipients || 0,
      foodWastePrevented: Math.round(foodWastePrevented),
      upcomingExpirations: upcomingExpirations || 0,
      pendingPickups: pendingPickups || 0,
      completionRate: parseFloat(completionRate),
    }

    res.json({ stats: dashboardStats })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get category distribution
router.get('/categories', async (req, res) => {
  try {
    const { data: foodItems, error } = await supabaseAdmin
      .from('food_items')
      .select('category, quantity')

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch category data' })
    }

    const categoryMap: Record<string, { count: number; totalQuantity: number }> = {}

    for (const item of foodItems || []) {
      if (!categoryMap[item.category]) {
        categoryMap[item.category] = { count: 0, totalQuantity: 0 }
      }
      categoryMap[item.category].count += 1
      categoryMap[item.category].totalQuantity += item.quantity
    }

    const categoryDistribution = Object.entries(categoryMap).map(([category, stats]) => ({
      category,
      ...stats,
    }))

    res.json({ categoryDistribution })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get monthly trends
router.get('/trends', async (req, res) => {
  try {
    const now = new Date()
    const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6))

    const { data: matches, error } = await supabaseAdmin
      .from('matches')
      .select('created_at, allocated_quantity')
      .gte('created_at', sixMonthsAgo.toISOString())

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch trends data' })
    }

    const monthlyData = []
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.setMonth(now.getMonth() - i))
      const monthKey = month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

      const monthMatches = (matches || []).filter(match => {
        const matchDate = new Date(match.created_at)
        return matchDate.getMonth() === month.getMonth() && matchDate.getFullYear() === month.getFullYear()
      })

      const donations = monthMatches.length
      const redistributed = monthMatches.reduce((sum, m) => sum + m.allocated_quantity, 0)

      monthlyData.push({
        month: monthKey,
        donations,
        redistributed,
      })
    }

    res.json({ monthlyData })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})