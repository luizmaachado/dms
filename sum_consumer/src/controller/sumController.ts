import { SumMessageModel } from "model/sumMessageModel";
import mqConnection from "../service/amqpConnection";

export class SumController {
    handleNotification = (msg: string) => {
        try {
            console.log(msg);
            var parsedMessage: SumMessageModel = JSON.parse(msg);


            console.log(`Received Notification`, parsedMessage);

            // Implement your own notification flow
            const result: number = this.makeSum(parsedMessage.payload.a, parsedMessage.payload.b);
            parsedMessage.payload.result = result;



        } catch (error) {
            console.error(`Error executing job`);
            parsedMessage.payload.error = error

        }
        finally {
            this.send(process.env.RECEIVING_QUEUE, parsedMessage.id, parsedMessage.payload)
        }
    };

    makeSum = (a: number, b: number): number => {
        return a + b;
    }

    send = async (name: string, id: string, payload: Record<string, any>) => {
        const newNotification = {
            name: name,
            id: id,
            payload: payload
        };

        this.sendNotification(newNotification);
    };


    sendNotification = async (notification: SumMessageModel) => {
        var next: string = notification.payload.nextSteps.shift();
        var queue: string = process.env.RETURN_QUEUE as string;
        if (next !== undefined) {
            queue = next;
        }
        await mqConnection.sendToQueue(queue, notification);

        console.log(`Sent the notification to consumer ${queue}`);
    };

}