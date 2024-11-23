"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paypal_controller_1 = __importDefault(require("../controllers/paypal.controller"));
const middleware_1 = __importDefault(require("../utils/middleware"));
const router = (0, express_1.Router)();
router.post('/create-order', middleware_1.default.jwtAuth(['user', 'admin']), paypal_controller_1.default.createOrder);
router.post('/capture-order', middleware_1.default.jwtAuth(['user', 'admin']), paypal_controller_1.default.captureOrder);
exports.default = router;
