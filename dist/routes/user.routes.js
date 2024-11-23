"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = __importDefault(require("../controllers/users.controller"));
const middleware_1 = __importDefault(require("../utils/middleware"));
const usersRouter = (0, express_1.Router)();
usersRouter.post('/', users_controller_1.default.createUser);
usersRouter.get('/', users_controller_1.default.getAllUsers);
usersRouter.put('/:id', middleware_1.default.jwtAuth, users_controller_1.default.updateUser);
usersRouter.get('/profile', middleware_1.default.jwtAuth(['user', 'admin']), users_controller_1.default.getUser);
usersRouter.delete('/:id', middleware_1.default.jwtAuth(['admin']), users_controller_1.default.deleteUser);
usersRouter.post('/cart/add', middleware_1.default.jwtAuth(['user', 'admin']), users_controller_1.default.addToCart);
usersRouter.post('/cart/remove', middleware_1.default.jwtAuth(['user', 'admin']), users_controller_1.default.removeFromCart);
usersRouter.get('/cart/', middleware_1.default.jwtAuth(['user', 'admin']), users_controller_1.default.getCart);
usersRouter.post('/cart/clear', middleware_1.default.jwtAuth(['user', 'admin']), users_controller_1.default.clearCart);
exports.default = usersRouter;
