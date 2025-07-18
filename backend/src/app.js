import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/users.routes.js";
import { connectToSocket } from "./controllers/socketManager.js";
const app = express();
const server = createServer(app); //creating a server instance
const io = connectToSocket(server); //creating a socket.io instance
import dotenv from "dotenv";
dotenv.config();

const mongoURL = process.env.MONGO_URL;

app.set("port", process.env.PORT || 3000);
app.use(cors()); //allowing cross-origin requests
app.use(express.json({ limit: "40kb" })); //parsing JSON requests
app.use(express.urlencoded({ extended: true, limit: "40kb" })); //parsing URL-encoded requests

app.use("/api/v1/users", userRoutes); //setting up user routes
//app.use("/api/v2/users", newUserRoutes); //this syntax will help to support versioning in the future

// app.get("/home", (req, res) => {
//   res.send("Welcome to the Home Page");
// });

const start = async () => {
  const connectionDb = await mongoose.connect(mongoURL);
  console.log(`MongoDB connected: ${connectionDb.connection.host}`);
  server.listen(app.get("port"), () => {
    console.log("Server is running on port 3000");
  });
};
start();

// const start = async () => {
//   app.listen(3000, () => {
//     console.log("Server is running on port 3000");
//   });
// };
// start();
