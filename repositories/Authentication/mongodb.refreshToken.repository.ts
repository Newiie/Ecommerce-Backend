import { RefreshToken } from "../../models/auth.model";
import { IRefreshToken } from './refreshToken.repository';

class MongoDbRefreshTokenRepository implements IRefreshToken {
    async saveRefreshToken(userId: string, token: string) {
        const refreshToken = new RefreshToken({ userId, token, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
        await refreshToken.save();
    }
    async revokeRefreshToken(token: string) {
        await RefreshToken.deleteOne({ token });
    }
    async isRefreshTokenValid(token: string): Promise<boolean> {
        const refreshToken = await RefreshToken.findOne({ token });
        return !!refreshToken;
    }
}

export default MongoDbRefreshTokenRepository