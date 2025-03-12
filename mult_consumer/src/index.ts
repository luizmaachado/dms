import { MultController } from "./controller/multController";
import mqConnection from "./service/amqpConnection";
import dotenv from 'dotenv';



async function main() {

    dotenv.config();

    var queue: string = process.env.RECEIVING_QUEUE as string;

    await mqConnection.connect();

    var multController = new MultController();

    await mqConnection.consume(queue, multController.handleNotification);
};

main();