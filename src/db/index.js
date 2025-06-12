import { connect } from "mongoose";

export const ConnectDB = async () => {
    try {
        await connect(process.env.MONGO_URI)
        console.log('Database connected successfully')
    } catch (error) {
        console.log(`Error connecting to database ${error}`)
    }
}