import { Request, Response, NextFunction } from "express";
import JwtUtils from "../utils/jwtUtils";
import { BlacklistedTokenModel } from "../model/blacklistedTokens/BlacklistedToken.model";


interface UserPayload {
    userId: string;
    email: string;
    token?: string;
    role?: string
}


declare module "express-serve-static-core" {
    interface Request {
        user?: UserPayload; // Extend Request with user
    }
}

const authMiddleWare = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Unauthorized" })
        return
    }
    const token = authHeader.split(" ")[1];

    try {
        // Check if token is blacklisted
        const blacklistedToken = await BlacklistedTokenModel.findOne({ token });
        if (blacklistedToken) {
            res.status(401).json({ error: "Token has been revoked" });
            return;
        }

        const decode = JwtUtils.verifyToken(token) as UserPayload;
        req.user = decode

        next()
    } catch (error) {
        console.error("Invalid token", error);
        res.status(403).json({ error: "Invalid token" })
        return
    }
}

export default authMiddleWare;