"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const PORT = process.env.PORT || "3001";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const MONGODB_URI = process.env.NODE_ENV === 'test'
    ? (process.env.TEST_MONGODB_URI || "your_default_test_mongodb_uri")
    : (process.env.MONGODB_URI || "your_default_mongodb_uri");
exports.default = {
    MONGODB_URI,
    PORT,
    FRONTEND_URL
};
