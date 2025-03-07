import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import compression from 'compression';
import router from './router';
import dotenv from 'dotenv';
import { connectDB } from './service/dbConnection';


async function main() {
    dotenv.config();

    await connectDB();

    const app = express();


    app.use(compression());
    app.use(bodyParser.json());

    const server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> = http.createServer(app);

    server.listen(8080, () => console.log('Server is running on http://localhost:8080'))

    app.use('/api', router());
}

main()