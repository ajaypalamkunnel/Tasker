import * as dotenv from 'dotenv'
import * as path from 'path';


const env = process.env.NODE_ENV || 'development';
if (env === 'development') {
  const envFilePath = path.resolve(process.cwd(), `.env.${env}`);
  dotenv.config({ path: envFilePath });
} else {
  
  dotenv.config(); 
}

export const config = {
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGODB_URI || '',
    nodeEnv: process.env.NODE_ENV || 'development',
    accessSecret:process.env.ACCESS_TOKEN_SECRET as string,
    refreshSecret:process.env.REFRESH_TOKEN_SECRET as string,
    accessTokenExpiry: parseInt(process.env.ACCESS_TOKEN_EXPIRY || "900000"), // 15min default
    refreshTokenExpiry: parseInt(process.env.REFRESH_TOKEN_EXPIRY || "86400000"), // 1day default
    local_origin:process.env.LOCAL_ORIGIN,
    vercel_origin:process.env.VERCEL_ORGIN,
    render_origin:process.env.RENDER_ORGIN
}

