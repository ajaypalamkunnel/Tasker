import mongoose, { Schema } from "mongoose";

interface IBlacklistedToken {
    token: string;
    userId: string;
    expiresAt: Date;
    createdAt: Date;
}

const BlacklistedTokenSchema: Schema<IBlacklistedToken> = new Schema(
    {
        token: {
            type: String,
            required: true,
            unique: true
        },
        userId: {
            type: String,
            required: true,
            index: true
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expireAfterSeconds: 0 } // Auto-delete expired tokens
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

export const BlacklistedTokenModel = mongoose.model<IBlacklistedToken>("BlacklistedToken", BlacklistedTokenSchema);
