"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchingRoutes = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const supabase_1 = require("../db/supabase");
const router = (0, express_1.Router)();
exports.matchingRoutes = router;
// Validation schemas
const generateMatchesSchema = zod_1.z.object({
    foodItemId: zod_1.z.string(),
    recipientIds: zod_1.z.array(zod_1.z.string()),
});
// Get eligible recipients
router.get('/recipients', async (req, res) => {
    try {
        const { data: recipients, error } = await supabase_1.supabaseAdmin
            .from('recipients')
            .select('*')
            .eq('status', 'eligible')
            .order('rating', { ascending: false });
        if (error) {
            return res.status(500).json({ error: 'Failed to fetch recipients' });
        }
        res.json({ recipients });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Get available food items
router.get('/food', async (req, res) => {
    try {
        const { data: foodItems, error } = await supabase_1.supabaseAdmin
            .from('food_items')
            .select('id, name, category, quantity, unit, available_quantity, expiry_date, storage_requirement, status')
            .gt('available_quantity', 0)
            .order('expiry_date', { ascending: true });
        if (error) {
            return res.status(500).json({ error: 'Failed to fetch food items' });
        }
        res.json({ foodItems });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Generate matches
router.post('/generate', async (req, res) => {
    try {
        const validatedData = generateMatchesSchema.parse(req.body);
        // Get food item
        const { data: foodItem, error: foodError } = await supabase_1.supabaseAdmin
            .from('food_items')
            .select('*')
            .eq('id', validatedData.foodItemId)
            .single();
        if (foodError || !foodItem) {
            return res.status(404).json({ error: 'Food item not found' });
        }
        // Get recipients
        const { data: recipients, error: recipientError } = await supabase_1.supabaseAdmin
            .from('recipients')
            .select('*')
            .in('id', validatedData.recipientIds)
            .eq('status', 'eligible');
        if (recipientError) {
            return res.status(500).json({ error: 'Failed to fetch recipients' });
        }
        // Generate matches using algorithm
        const matches = await generateMatches(foodItem, recipients || []);
        res.json({ matches });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Invalid input', details: error.errors });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Save match
router.post('/save', async (req, res) => {
    try {
        const { foodItemId, recipientId, allocatedQuantity } = req.body;
        // Start transaction-like operation
        const { data: foodItem, error: foodError } = await supabase_1.supabaseAdmin
            .from('food_items')
            .select('available_quantity')
            .eq('id', foodItemId)
            .single();
        if (foodError || !foodItem) {
            return res.status(404).json({ error: 'Food item not found' });
        }
        if (foodItem.available_quantity < allocatedQuantity) {
            return res.status(400).json({ error: 'Insufficient available quantity' });
        }
        // Update food item quantity
        const { error: updateError } = await supabase_1.supabaseAdmin
            .from('food_items')
            .update({ available_quantity: foodItem.available_quantity - allocatedQuantity })
            .eq('id', foodItemId);
        if (updateError) {
            return res.status(500).json({ error: 'Failed to update food item' });
        }
        // Create match record
        const { data: match, error: matchError } = await supabase_1.supabaseAdmin
            .from('matches')
            .insert({
            food_item_id: foodItemId,
            recipient_id: recipientId,
            allocated_quantity: allocatedQuantity,
            status: 'approved',
            created_at: new Date().toISOString(),
        })
            .select('*')
            .single();
        if (matchError) {
            return res.status(500).json({ error: 'Failed to create match' });
        }
        res.json({ match });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
async function generateMatches(foodItem, recipients) {
    // Simple matching algorithm based on category compatibility
    const matches = [];
    for (const recipient of recipients) {
        let score = 0;
        const reasons = [];
        // Category match
        if (recipient.accepted_categories.includes('all') || recipient.accepted_categories.includes(foodItem.category)) {
            score += 40;
        }
        else {
            reasons.push('category_mismatch');
        }
        // Quantity match
        if (foodItem.available_quantity <= recipient.max_capacity) {
            score += 30;
        }
        else {
            reasons.push('quantity_exceeded');
        }
        // Storage compatibility
        if (recipient.storage_capabilities.includes(foodItem.storage_requirement)) {
            score += 30;
        }
        else {
            reasons.push('storage_incompatible');
        }
        // Only include matches with minimum score
        if (score >= 60) {
            matches.push({
                recipientId: recipient.id,
                foodItemId: foodItem.id,
                allocatedQuantity: Math.min(foodItem.available_quantity, recipient.max_capacity),
                score,
                reasons,
            });
        }
    }
    return matches;
}
// Get all matches
router.get('/', async (req, res) => {
    try {
        const { data: matches, error } = await supabase_1.supabaseAdmin
            .from('matches')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            return res.status(500).json({ error: 'Failed to fetch matches' });
        }
        res.json({ matches });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
//# sourceMappingURL=matching.js.map