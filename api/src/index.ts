import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import compression from 'compression';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const MONGO_URL = process.env.MONGO_URL;

const app = express();


app.use(compression());
app.use(bodyParser.json());

const server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> = http.createServer(app);

server.listen(8080, () => console.log('Server is running on http://localhost:8080'))


mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));
mongoose.connection.once('open', () => console.log('Connected mongo'));


