"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const product_controller_1 = __importDefault(require("../controllers/product.controller"));
const middleware_1 = __importDefault(require("../utils/middleware"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() }).fields([
    { name: 'productImage', maxCount: 1 },
    { name: 'variationImages', maxCount: 10 },
]);
router.get('/:id', product_controller_1.default.getProduct);
router.get('/', product_controller_1.default.getAllProduct);
router.post('/', middleware_1.default.jwtAuth(['admin']), upload, product_controller_1.default.createProduct);
router.put('/:id', middleware_1.default.jwtAuth(['admin']), upload, product_controller_1.default.updateProduct);
router.delete('/:id', middleware_1.default.jwtAuth(['admin']), product_controller_1.default.deleteProduct);
exports.default = router;
