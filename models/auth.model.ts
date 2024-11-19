import mongoose, {Schema} from "mongoose";

interface IRefreshToken {
    userId: string;
    token: string;
    expiresAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>({
    userId: { type: String, required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});

export const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', refreshTokenSchema);