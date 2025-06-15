import express from 'express'
import config from './config/index.js';
import { ConnectDB } from './db/index.js';
import { creatSuperadmin } from './db/create-superadmin.js';
import adminRouter from './routes/admin.route.js'
import transportRouter from './routes/transport.route.js'
import ticketRouter from './routes/ticket.route.js'
import customerRouter from './routes/customer.route.js'
import cookieparser from 'cookie-parser'



const app = express()

await ConnectDB()
await creatSuperadmin()

app.use(cookieparser())

app.use(express.json())

app.use('/admin', adminRouter)
app.use('/transport', transportRouter)
app.use('/ticket', ticketRouter)
app.use('/customer', customerRouter)


app.listen(config.PORT, () => {
    console.log('server running on port', +config.PORT) 
})