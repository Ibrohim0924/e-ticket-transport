import express from 'express'
import { config } from "dotenv";
import { ConnectDB } from './db/index.js';
import { creatSuperadmin } from './db/create-superadmin.js';
import adminRouter from './routes/admin.route.js'
config()


const app = express()
const PORT = Number(process.env.PORT)

await ConnectDB()
await creatSuperadmin()

app.use(express.json())

app.use('/admin', adminRouter)



app.listen(PORT, () => {
    console.log('server running on port', PORT) 
})