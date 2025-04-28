import express from "express";
import "dotenv/config";
import router from "./router";
import { connectDB } from "./config/db";

const app = express();

connectDB(); // Connect to MongoDB

//Leer JSON data from the request body
app.use(express.json());

app.use("/", router);

export default app;
