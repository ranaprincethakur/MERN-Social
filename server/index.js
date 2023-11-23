import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import AuthRoute from "./Routes/AuthRoute.js";
import UserRoute from "./Routes/UserRoute.js";
import PostRoute from "./Routes/PostRoute.js";
import UploadRoute from "./Routes/UploadRoute.js";
import ChatRoute from "./Routes/ChatRoute.js";
import MessageRoute from "./Routes/MessageRoute.js";

//config env
dotenv.config();

//database config
connectDB();

const app = express();

//to serve images for public
app.use(express.static("public"));
app.use("/images", express.static("images"));

//middlewares
app.use(express.json());

//Routes
app.use("/api/auth", AuthRoute);
app.use("/api/user", UserRoute);
app.use("/api/post", PostRoute);
app.use("/api/upload", UploadRoute);
app.use("/api/chat", ChatRoute);
app.use("/api/message", MessageRoute);

//Port
const PORT = process.env.PORT;

//run listen
app.listen(PORT, () => {
  console.log(`Server is Running on ${PORT}`);
});
