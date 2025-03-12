import { SumController } from "./controller/sumController";
import mqConnection from "./service/amqpConnection";
import dotenv from 'dotenv';



async function main() {

    dotenv.config();

    var queue: string = process.env.NOTIFICATION_QUEUE as string;

    await mqConnection.connect();

    var sumController = new SumController();

    await mqConnection.consume(queue, sumController.handleNotification);
};

main();