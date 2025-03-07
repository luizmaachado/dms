import express from 'express';
import { createTask, getTasks } from '../db/task';

export const postTask: express.RequestHandler = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const { title, description } = req.body;
        console.log(title, description);
        const task = await createTask({ title, description });
        res.status(200).json(task);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Failed to create task' });
    }
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