import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import productRouter from './routes/product';

dotenv.config()

const app = express();
app.use(express.json())

app.use('/api', productRouter)

function connect() {
    try {
        mongoose.connect(process.env.URL_DB)
        console.log("You have connected to mongodb");
    } catch (err) {
        console.log(err)
    }
}
connect()

export const viteNodeApp = app;