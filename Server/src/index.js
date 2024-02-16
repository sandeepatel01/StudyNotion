import connectDatabase from "./db/db"
import dotenv from "dotenv"

dotenv.config({
    path: "./env"
});

connectDatabase()