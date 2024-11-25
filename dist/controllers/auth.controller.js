"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("../services/auth.service"));
const logger_1 = __importDefault(require("../utils/logger"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthController {
    authService;
    constructor() {
        this.authService = new auth_service_1.default;
    }
    refreshToken = async (req, res, next) => {
        try {
            if (req.cookies === undefined)
                return res.status(401).json({ message: 'No cookies provided' });
            const refreshToken = req.cookies.refreshToken;
            console.log("Cookies ", req.cookies);
            if (refreshToken === undefined)
                return res.status(401).json({ message: 'Refresh token not provided' });
            const isValid = await this.authService.isRefreshTokenValid(refreshToken);
            if (!isValid)
                return res.status(401).json({ message: 'Invalid refresh token' });
            const secret = process.env.REFRESH_TOKEN_SECRET;
            const decoded = jsonwebtoken_1.default.verify(refreshToken, secret);
            const newAccessToken = this.authService.generateAccessToken(decoded.id, decoded.role);
            const newRefreshToken = this.authService.generateRefreshToken(decoded.id, decoded.role);
            await this.authService.saveRefreshToken(decoded.id, newRefreshToken);
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            });
            return res.status(200).json({ accessToken: newAccessToken });
        }
        catch (error) {
            logger_1.default.error(error);
            next(error);
        }
    };
    login = async (req, res, next) => {
        try {
            const { username, password } = req.body;
            const result = await this.authService.authenticateUser(username, password);
            if (result.error) {
                return res.status(401).json({ error: result.error });
            }
            const { accessToken, refreshToken, id, role } = result;
            console.log('Login successful');
            console.log("Refresh Token: ", refreshToken);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return res.status(200).json({ token: accessToken, userId: id, role });
        }
        catch (error) {
            next(error);
        }
    };
    logout = async (req, res, next) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res.status(200).json({ message: 'User already logged out' });
            }
            try {
                await this.authService.revokeRefreshToken(refreshToken);
            }
            catch (error) {
                logger_1.default.error('Failed to revoke refresh token:', error);
            }
            // Clear the refresh token cookie
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            });
            return res.status(200).json({ message: 'Logged out successfully' });
        }
        catch (error) {
            logger_1.default.error(error);
            next(error);
        }
    };
}
exports.default = new AuthController();
