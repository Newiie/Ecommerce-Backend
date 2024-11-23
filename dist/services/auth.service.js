"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongodb_user_repository_1 = __importDefault(require("../repositories/User/mongodb.user.repository"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const auth_model_1 = require("../models/auth.model");
class AuthService {
    userRepository;
    constructor() {
        this.userRepository = new mongodb_user_repository_1.default;
    }
    isRefreshTokenValid = async (token) => {
        const hashedToken = this.hashToken(token);
        const storedToken = await auth_model_1.RefreshToken.findOne({ token: hashedToken });
        return !!storedToken;
    };
    hashToken = (token) => {
        const secret = process.env.HASHED_TOKEN;
        return bcrypt_1.default.hashSync(token, secret);
    };
    saveRefreshToken = async (userId, token) => {
        const hashedToken = this.hashToken(token);
        const refreshToken = new auth_model_1.RefreshToken({ userId, token: hashedToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
        await refreshToken.save();
    };
    revokeRefreshToken = async (token) => {
        const hashedToken = this.hashToken(token);
        await auth_model_1.RefreshToken.deleteOne({ token: hashedToken });
    };
    generateAccessToken(userId, role) {
        const payload = { id: userId, role: role };
        const secret = process.env.JWT_SECRET;
        const options = { expiresIn: '15m' };
        return jsonwebtoken_1.default.sign(payload, secret, options);
    }
    generateRefreshToken(userId, role) {
        const payload = { id: userId, role: role };
        const secret = process.env.REFRESH_TOKEN_SECRET;
        const options = { expiresIn: '7d' };
        return jsonwebtoken_1.default.sign(payload, secret, options);
    }
    async authenticateUser(username, password) {
        const user = await this.userRepository.findByUsername(username);
        if (!user) {
            throw new AppError_1.default('User does not exist', 401);
        }
        const passwordCorrect = user.passwordHash
            ? await bcrypt_1.default.compare(password, user.passwordHash)
            : false;
        if (!passwordCorrect) {
            throw new AppError_1.default('Invalid username or password', 401);
        }
        const accessToken = this.generateAccessToken(user._id.toString(), user.role.toString()); // Assuming this is your short-term token
        const refreshToken = this.generateRefreshToken(user._id.toString(), user.role.toString()); // Implement this method
        await this.saveRefreshToken(user._id.toString(), refreshToken);
        return {
            id: user._id.toString(),
            accessToken: accessToken,
            refreshToken: refreshToken,
            role: user.role
        };
    }
}
exports.default = AuthService;
