import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import http from "http";
import { Server } from "socket.io";

//config
dotenv.config()
const app = express();

//middleware
app.use(express.json())
app.use(cors())
const io = new Server(3001, {
    cors: {
        origin: "*",
    }
}); 

io.on("connection", (socket) => { ///Handle khi có connect từ client tới
    console.log("New client connected" + socket.id); 
  
    socket.on("sendDataClient", function(data) { // Handle khi có sự kiện tên là sendDataClient từ phía client
      socket.emit("sendDataServer", { data });// phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
    })
  
    socket.on("disconnect", () => {
      console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
    });
});
