import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import router from './router';
import { connectDB } from './config/db';
import { corsConfig } from './config/cors';

connectDB(); // Connect to MongoDB

const app = express();

//Cors
app.use(cors(corsConfig));

//Leer JSON data from the request body
app.use(express.json());

app.use('/', router);

export default app;
