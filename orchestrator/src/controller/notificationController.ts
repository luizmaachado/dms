import { Message } from "model/message";
import mqConnection from "../service/amqpConnection";
import axios from 'axios';

export class NotificationController {
    handleAPINotification = (msg: string) => {
        try {
            console.log(msg);
            const parsedMessage: Message = JSON.parse(msg);


            console.log(`Received Notification`, parsedMessage);
            parsedMessage.payload.nextSteps = []

            if (parsedMessage.name === 'sumAndMult') {
                parsedMessage.payload.nextSteps.push('mult')
                this.send('sum', parsedMessage.id, parsedMessage.payload,);
            }
            if (parsedMessage.name === 'sum') {
                this.send('sum', parsedMessage.id, parsedMessage.payload,);
            }

        } catch (error) {
            console.error(`Error executing job`);
        }
    };

    handleTaskNotification = (msg: string) => {
        try {
            const parsedMessage: Message = JSON.parse(msg);
            console.log(parsedMessage);
            if (parsedMessage.payload.has_error) {
                if (parsedMessage.payload.has_error > 3) {
                    console.log("Multiple errors detected, task failed");
                    this.updateTask(parsedMessage.id, { "status": "failed" })

                }
                else {
                    console.log("Error detected, resending task to queue");
                    this.send(parsedMessage.name, parsedMessage.id, parsedMessage.payload);
                }
            }
            else {
                this.updateTask(parsedMessage.id, { "status": "completed" })
            }


        } catch (error) {
            console.error(`Error executing job`);
        }
    };

    send = async (name: string, id: string, payload: Record<string, any>) => {
        const newNotification = {
            name: name,
            id: id,
            payload: payload
        };

        this.sendNotification(newNotification);
    };


    sendNotification = async (notification: Message) => {
        await mqConnection.sendToQueue(notification.name, notification);

        console.log(`Sent the notification to consumer ${notification.name}`);
    };

    updateTask = async (taskId: string, updates: Record<string, any>): Promise<void> => {
        try {
            const response = await axios.patch(`${process.env.API_URL}/task/${taskId}`, updates);

        } catch (error) {
            console.error("Error updating task:", error);
        }
    };


}