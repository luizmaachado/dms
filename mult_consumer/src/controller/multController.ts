import { MultMessageModel } from "model/multMessageModel";
import mqConnection from "../service/amqpConnection";
import { error } from "console";

export class MultController {
    handleNotification = (msg: string) => {
        try {
            console.log(msg);
            var parsedMessage: MultMessageModel = JSON.parse(msg);


            console.log(`Received Notification`, parsedMessage);

            // Implement your own notification flow
            const result: number = this.makeMult(parsedMessage.payload.result, parsedMessage.payload.c);
            if (!result) {
                throw error
            }

            console.log(`Mult of ${parsedMessage.payload.result} and ${parsedMessage.payload.c} is ${result}`);
            parsedMessage.payload.result = result;



        } catch (error) {
            console.error(`Error executing job`);
            parsedMessage.payload.error = error;

        }
        finally {
            console.log(parsedMessage.payload)
            this.send(process.env.RECEIVING_QUEUE, parsedMessage.id, parsedMessage.payload)
        }
    };

    makeMult = (a: number, b: number): number => {
        return a * b;
    }

    send = async (name: string, id: string, payload: Record<string, any>) => {
        const newNotification = {
            name: name,
            id: id,
            payload: payload
        };

        this.sendNotification(newNotification);
    };


    sendNotification = async (notification: MultMessageModel) => {
        await mqConnection.sendToQueue(process.env.RETURN_QUEUE, notification);

        console.log(`Sent the notification to consumer`);
    };

}