import dotenv from 'dotenv';
import mqConnection from './service/amqpConnection';
import { connectDB } from './service/dbConnection';
import { NotificationController } from './controller/notificationController';

async function main() {

    dotenv.config();

    await connectDB();

    var queue: string = process.env.NOTIFICATION_QUEUE as string;

    await mqConnection.connect();

    var notificationController = new NotificationController

    mqConnection.consume(process.env.CONSUME_QUEUE_NAME, notificationController.handleAPINotification);
    mqConnection.consume(process.env.RETURN_QUEUE_NAME, notificationController.handleTaskNotification);

};

main();