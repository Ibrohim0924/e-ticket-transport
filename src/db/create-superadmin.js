import Admin from "../models/admin.model.js";
import { Crypto } from "../utils/encrypt-dcrypt.js"
import config from "../config/index.js";


const crypto = new Crypto()

export const creatSuperadmin = async () => {
    try {
        const existsSuperadmin = await Admin.findOne({role: 'superadmin'})
        if(!existsSuperadmin){
            const hashedPassword = await crypto.encrypt(config.SUPERADMIN_PASSWORD)
            await Admin.create({
                username: config.SUPERADMIN_USERNAME,
                hashedPassword,
                role: 'superadmin'
            })
            console.log('SuperAdmin created successfully')
        }
    } catch (error) {
        console.log(`Error creating superadmin ${error}`)
    }
}