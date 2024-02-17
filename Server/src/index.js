import connectDatabase from "./db/db.js"
import dotenv from "dotenv"
import { app } from "./app.js";

dotenv.config({
    path: "./env"
});



// When Database Connected 
connectDatabase()
    .then(() => {
        app.on("error", (error) => {
            console.log("ERROR: ", error);
            throw error
        });

        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server is Running at port: ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log("Mongo DB connection Failed!!", error);
    });