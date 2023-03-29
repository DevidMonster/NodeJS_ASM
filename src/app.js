import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import productRouter from './routes/product';
import authRouter from './routes/auth';
import cors from 'cors';

//config
dotenv.config()
const app = express();

//middleware
app.use(express.json())
app.use(cors())

//router
app.use('/api', productRouter)
app.use('/auth', authRouter)

//connection
const connect = async() => {
    try {
        await mongoose.connect(process.env.URL_DB)
        console.log("You have connected to mongodb");
    } catch (err) {
        console.log(err)
    }
}

connect()

//listen port
export const viteNodeApp = app;