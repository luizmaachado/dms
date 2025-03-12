import express from 'express';
import { createTask, getTasks } from '../db/task';
import { sendNotification } from '../service/sender';

export const postTask: express.RequestHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const { title, description, payload } = req.body;
        console.log(title, description);
        const task = await createTask({ title, description, payload });
        send(title, description, payload);
        res.status(200).json(task);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Failed to create task' });
    }
};

export const send = async (title: string, description: string, payload: Record<string, any>) => {
    const newNotification = {
        title: title,
        description:
            description,
        payload: payload
    };

    sendNotification(newNotification);
};

export const getAll: express.RequestHandler = async (_req: express.Request, res: express.Response): Promise<void> => {
    try {
        const tasks = await getTasks();
        res.status(200).json(tasks);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Failed to get tasks' });
    }
};