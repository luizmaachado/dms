import express from 'express';
import { postTask, getAll } from '../controller/task';

export default (router: express.Router) => {
    router.post('/task', postTask);
    router.get('/task', getAll);
};