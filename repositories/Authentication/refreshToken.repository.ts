export interface IRefreshToken {
    saveRefreshToken(userId: string, token: string): Promise<void>;
    revokeRefreshToken(token: string): Promise<void>;
    isRefreshTokenValid(token: string): Promise<boolean>;
}