import { hash } from "bcrypt";
import Admin from "../models/admin.model.js";
import { Crypto } from "../utils/encrypt-dcrypt.js"
import { config } from "dotenv";
config()

const crypto = new Crypto()

export const creatSuperadmin = async () => {
    try {
        const existsSuperadmin = await Admin.findOne({role: 'superadmin'})
        if(!existsSuperadmin){
            const hashedPassword = await crypto.encrypt(process.env.SUPERADMIN_PASSWORD)
            await Admin.create({
                username: process.env.SUPERADMIN_USERNAME,
                hashedPassword,
                role: 'superadmin'
            })
            console.log('SuperAdmin created successfully')
        }
    } catch (error) {
        console.log(`Error creating superadmin ${error}`)
    }
}