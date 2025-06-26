import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config({
    path: './.env'
})

const db = () => {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log("connected to database")
        })
        .catch((error) => {
            console.log("failed to connect to db")
            console.error(error)
            process.exit(1)
        })
}

export default db;