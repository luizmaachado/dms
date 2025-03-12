import express from 'express';
import { create, getAll, update } from '../model/task';
import mqConnection from '../service/amqpConnection';
import { Message } from 'model/message';

export const postTask: express.RequestHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const { title, description, payload } = req.body;
        console.log(title, description);
        const task = await create({ title, description, payload });
        send(task.title, task._id.toString(), payload);
        res.status(200).json(task);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Failed to create task' });
    }
};

const send = async (name: string, id: string, payload: Record<string, any>) => {
    const newNotification = {
        name: name,
        id: id,
        payload: payload
    };

    sendNotification(newNotification);
};


const sendNotification = async (notification: Message) => {
    await mqConnection.sendToQueue(process.env.DECIDER_QUEUE_NAME, notification);

    console.log(`Sent the notification to consumer`);
};

export const getAllTasks: express.RequestHandler = async (_req: express.Request, res: express.Response): Promise<void> => {
    try {
        const tasks = await getAll();
        res.status(200).json(tasks);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Failed to get tasks' });
    }
};

export const updateTask: express.RequestHandler = async (_req: express.Request, res: express.Response): Promise<void> => {
    try {
        const { id } = _req.params
        const body = _req.body;
        console.log(body)

        if (!body) {
            res.status(400).json({ error: 'Task is required' });
        }

        const task = await update(id, body);
        res.status(200).json({});
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Failed to update task' });
    }
};

export { getAll };
