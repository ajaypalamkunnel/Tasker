import jwt, { JwtPayload } from 'jsonwebtoken'
import { config } from '../config/env'

const ACCESS_TOKEN_SECRET = config.accessSecret
const REFRESH_TOKEN_SECRET = config.refreshSecret


class JWTUtils {

    static generateAccessToken(payload: object): string {
        return jwt.sign(payload, ACCESS_TOKEN_SECRET, { 
            expiresIn: "30m",
            issuer: "tasker-app",
            audience: "tasker-users"
        })
    }

    static generateRefreshToken(payload: object): string {
        return jwt.sign(payload, REFRESH_TOKEN_SECRET, { 
            expiresIn: '7d',
            issuer: "tasker-app",
            audience: "tasker-users"
        })
    }

    static verifyToken(token: string, isRefreshToken?: boolean): string | JwtPayload | null {
        try {
            const secret = isRefreshToken ? REFRESH_TOKEN_SECRET : ACCESS_TOKEN_SECRET

            const decode = jwt.verify(token, secret, {
                issuer: "tasker-app",
                audience: "tasker-users"
            })
            return decode
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                console.error("Token has expired");
                return { message: "Token expired" }
            } else if (error instanceof jwt.JsonWebTokenError) {
                console.error("Invalid token signature");
            }
            return null
        }
    }


}

export default JWTUtils