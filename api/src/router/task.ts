import express from 'express';
import { postTask, getAllTasks, updateTask } from '../controller/taskController';

export default (router: express.Router) => {
    router.post('/task', postTask);
    router.get('/task', getAllTasks);
    router.patch('/task/:id', updateTask);
};