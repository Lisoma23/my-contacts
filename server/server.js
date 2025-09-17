import express from 'express'
import connectMongo from './config/mongoDBConfig.js'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config({ path: '.env' })

const app = express()
const port = process.env.port
const corsOrigin = process.env.corsOrigin

app.use(cors({ origin: `${corsOrigin}` }))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

connectMongo();