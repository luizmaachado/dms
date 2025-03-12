import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import compression from 'compression';
import router from './router';
import dotenv from 'dotenv';
import { connectDB } from './service/dbConnection';
import mqConnection from './service/amqpConnection';


async function main() {
    dotenv.config();

    await connectDB();

    await mqConnection.connect();

    const app = express();


    app.use(compression());
    app.use(bodyParser.json());

    const server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> = http.createServer(app);

    server.listen(process.env.PORT, () => console.log('Server is running'))

    app.use('/api', router());
}

main()