"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_model_1 = require("../../models/auth.model");
class MongoDbRefreshTokenRepository {
    async saveRefreshToken(userId, token) {
        const refreshToken = new auth_model_1.RefreshToken({ userId, token, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
        await refreshToken.save();
    }
    async revokeRefreshToken(token) {
        await auth_model_1.RefreshToken.deleteOne({ token });
    }
    async isRefreshTokenValid(token) {
        const refreshToken = await auth_model_1.RefreshToken.findOne({ token });
        return !!refreshToken;
    }
}
exports.default = MongoDbRefreshTokenRepository;
