"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const supabase_1 = require("../db/supabase");
const router = (0, express_1.Router)();
exports.authRoutes = router;
// Validation schemas
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    fullName: zod_1.z.string().min(2),
    role: zod_1.z.enum(['donor', 'recipient', 'admin', 'volunteer']),
    organization: zod_1.z.string().optional(),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const validatedData = registerSchema.parse(req.body);
        // Check if user exists
        const { data: existingUser } = await supabase_1.supabaseAdmin
            .from('users')
            .select('id')
            .eq('email', validatedData.email)
            .single();
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(validatedData.password, 12);
        // Create user
        const { data: user, error } = await supabase_1.supabaseAdmin
            .from('users')
            .insert({
            email: validatedData.email,
            password_hash: hashedPassword,
            full_name: validatedData.fullName,
            role: validatedData.role,
            organization: validatedData.organization,
        })
            .select('id, email, full_name, role')
            .single();
        if (error) {
            return res.status(500).json({ error: 'Failed to create user' });
        }
        // Generate token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
        res.json({ token, user });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Invalid input', details: error.errors });
        }
    }
});
// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const validatedData = loginSchema.parse(req.body);
        // Get user
        const { data: user, error } = await supabase_1.supabaseAdmin
            .from('users')
            .select('id, email, full_name, role, password_hash')
            .eq('email', validatedData.email)
            .single();
        if (error || !user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Verify password
        const isValid = await bcryptjs_1.default.compare(validatedData.password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Generate token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
        // Remove password from response
        const { password_hash, ...userData } = user;
        res.json({ token, user: userData });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Invalid input', details: error.errors });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// Get current user endpoint
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        const { data: user, error } = await supabase_1.supabaseAdmin
            .from('users')
            .select('id, email, full_name, role, organization')
            .eq('id', decoded.userId)
            .single();
        if (error || !user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ user });
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
});
//# sourceMappingURL=auth.js.map