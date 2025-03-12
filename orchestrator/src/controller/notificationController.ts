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

        } catch (error) {
            console.error(`Error executing job`);
        }
    };

    handleTaskNotification = (msg: string) => {
        try {
            const parsedMessage: Message = JSON.parse(msg);
            console.log(parsedMessage.payload)
            if (parsedMessage.payload.error) {
                console.log("erro catastrofico")
            }
            this.updateTask(parsedMessage.id, { "status": "completed" })


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

        console.log(`Sent the notification to consumer`);
    };

    updateTask = async (taskId: string, updates: Record<string, any>): Promise<void> => {
        try {
            const response = await axios.patch(`${process.env.API_URL}/task/${taskId}`, updates, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer YOUR_ACCESS_TOKEN`, // Add authentication if required
                },
            });

        } catch (error) {
            console.error("Error updating task:", error);
        }
    };


}