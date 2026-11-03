"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const init_1 = require("./db/init");
const PORT = parseInt(process.env.PORT || '3001', 10) || 3001;
async function start() {
    try {
        // Initialize database
        await (0, init_1.initializeDatabase)();
        console.log('✅ Database initialized successfully');
        // Start server
        app_1.default.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 FoodBridge API Server running on port ${PORT}`);
            console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
start();
//# sourceMappingURL=index.js.map