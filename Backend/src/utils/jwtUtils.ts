import jwt, { JwtPayload } from 'jsonwebtoken'
import { config } from '../config/env'

const ACCESS_TOKEN_SECRET = config.accessSecret
const REFRESH_TOKEN_SECRET = config.refreshSecret
const ACCESS_TOKEN_EXPIRY = config.accessTokenExpiry
const REFRESH_TOKEN_EXPIRY = config.refreshTokenExpiry

class JWTUtils {

    static generateAccessToken(payload: object): string {
    
        return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "40m" })
    }

     static generateRefreshToken(payload:object):string{
        return jwt.sign(payload,REFRESH_TOKEN_SECRET,{expiresIn:'7d'})
    }

    static verifyToken(token:string,isRefereshToken?:boolean):string|JwtPayload|null{
          try {
            const secret = isRefereshToken ? REFRESH_TOKEN_SECRET : ACCESS_TOKEN_SECRET

            const decode = jwt.verify(token,secret)
            return decode
        } catch (error) {
            if(error instanceof jwt.TokenExpiredError){
                console.error("Token has expired");
                return {message:"Token expired"}
                
            }else if(error instanceof jwt.JsonWebTokenError){
                console.error("Invalid token signature");
                
            }
            return null
        }
    }


}

export default JWTUtils