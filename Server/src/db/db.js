import mongoose from "mongoose";
import { DB_NAME } from "../constants"


const connectDatabase = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

        console.log(`\n MONGODB CONNECTED !! DB HOST: ${connectionInstance.connection.host}`);

    } catch (error) {
        console.log("MongoDB connection Failed!!", error);
        process.exit(1)
    }
}
export default connectDatabase;