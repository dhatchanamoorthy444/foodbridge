"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const init_1 = require("./db/init");
const PORT = parseInt(process.env.PORT || '3001', 10) || 3001;
async function startServer() {
    try {
        // Initialize database
        await (0, init_1.initializeDatabase)();
        console.log('✅ Database initialized successfully');
        // Start server
        app_1.default.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 FoodBridge API Server running on port ${PORT}`);
            console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🔄 SIGTERM received, shutting down gracefully');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('🔄 SIGINT received, shutting down gracefully');
    process.exit(0);
});
startServer();
//# sourceMappingURL=server.js.map