import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import productRouter from './routes/product';
import authRouter from './routes/auth';

dotenv.config()

const app = express();
app.use(express.json())

app.use('/api', productRouter)
app.use('/auth', authRouter)


try {
    mongoose.connect(process.env.URL_DB)
    console.log("You have connected to mongodb");
} catch (err) {
    console.log(err)
}


export const viteNodeApp = app;