"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const errorHandler_1 = require("./middleware/errorHandler");
const auth_1 = require("./middleware/auth");
const auth_2 = require("./routes/auth");
const inventory_1 = require("./routes/inventory");
const matching_1 = require("./routes/matching");
const pickups_1 = require("./routes/pickups");
const analytics_1 = require("./routes/analytics");
const notifications_1 = require("./routes/notifications");
const init_1 = require("./db/init");
const app = (0, express_1.default)();
// CORS origins: deployed frontend (FRONTEND_URL) plus optional extra origin (CORS_ORIGIN)
const corsOrigins = [process.env.FRONTEND_URL, process.env.CORS_ORIGIN].filter((origin) => Boolean(origin));
if (corsOrigins.length === 0) {
    corsOrigins.push('http://localhost:5173');
}
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: corsOrigins,
    credentials: true,
}));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Health check endpoints
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.get('/api/health', (req, res) => {
    const db = (0, init_1.getDbHealth)();
    res.status(200).json({
        status: 'success',
        message: 'FoodBridge backend is running',
        database: {
            ok: db.ok,
            checkedAt: db.checkedAt,
            tables: db.tables.map(({ table, ok, error, rows }) => ({
                table,
                ok,
                ...(rows !== undefined ? { rows } : {}),
                ...(error ? { error } : {}),
            })),
        },
        timestamp: new Date().toISOString(),
    });
});
// API Routes
app.use('/api/auth', auth_2.authRoutes);
app.use('/api/inventory', auth_1.authMiddleware, inventory_1.inventoryRoutes);
app.use('/api/matching', auth_1.authMiddleware, matching_1.matchingRoutes);
app.use('/api/pickups', auth_1.authMiddleware, pickups_1.pickupRoutes);
app.use('/api/analytics', auth_1.authMiddleware, analytics_1.analyticsRoutes);
app.use('/api/notifications', auth_1.authMiddleware, notifications_1.notificationRoutes);
// Error handling middleware
app.use(errorHandler_1.errorHandler);
// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});
exports.default = app;
//# sourceMappingURL=app.js.map