import express from "express";
import { config } from "./config/env";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ROUTE_PATH } from "./constants/routePath";
import userRoute from "./routes/userRouter";
import morganMiddleware from "./middleware/morganMiddleware";
const app = express();
const PORT = config.port;
const LOCAL_ORIGIN = config.local_origin;
const VERCEL_ORIGIN = config.vercel_origin;
const RENDER_ORIGIN = config.render_origin;

const allowedOrigins = [LOCAL_ORIGIN, VERCEL_ORIGIN, RENDER_ORIGIN];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);
app.use(cookieParser());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(morganMiddleware);


app.get("/", (_req, res) => {
    res.send("Hello, TypeScript + Express + MongoDB with Environments!");
});

app.use(ROUTE_PATH.USER, userRoute);

const startServer = async () => {
    try {
        await mongoose.connect(config.mongoURI);
        console.log("MongoDB connected ✅");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}✅`);
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB ❌", error);
    }
};
startServer();
