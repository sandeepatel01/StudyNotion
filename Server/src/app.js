import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGINS,
    credentials: true
}))

app.use(cookieParser());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded(
    {
        extended: true,
        limit: "16kb"
    }
));
app.use(express.static('public'));


// Routes Import 
import userRouter from "./routes/user.route.js";
import courseRouter from "./routes/course.route.js";

// Routes Declaration 
app.use("/api/v1/users", userRouter);
app.use('/api/v1/course', courseRouter);


export { app };