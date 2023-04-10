import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import productRouter from './routes/product';
import authRouter from './routes/auth';
import categoryRouter from './routes/category';
import userRouter from './routes/user';
import cmtRouter from './routes/comment';

//config
dotenv.config()
const app = express();

//middleware
app.use(express.json())
app.use(cors())

//router
app.use('/api', productRouter)
app.use('/api', categoryRouter)
app.use('/auth', authRouter)
app.use('/api', userRouter)
app.use('/api', cmtRouter)


//connection
const connect = async () => {
    try {
        await mongoose.connect(process.env.URL_DB)
        console.log("You have connected to mongodb");
    } catch (err) {
        console.log(err.message)
    }
}

connect()


//listen port
export const viteNodeApp = app;