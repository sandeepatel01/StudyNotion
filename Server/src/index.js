import connectDatabase from "./db/db.js"
import dotenv from "dotenv"

dotenv.config({
    path: "./env"
});

connectDatabase()