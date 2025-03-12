import express from 'express';
import { postTask, getAll } from '../controller/taskController';

export default (router: express.Router) => {
    router.post('/task', postTask);
    router.get('/task', getAll);
};