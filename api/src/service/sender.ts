import mqConnection from "./amqpConnection";

export type INotification = {
    title: string;
    description: string;
    payload: Record<string, any>;
};

export const sendNotification = async (notification: INotification) => {
    await mqConnection.sendToQueue(notification.title, notification);

    console.log(`Sent the notification to consumer`);
};