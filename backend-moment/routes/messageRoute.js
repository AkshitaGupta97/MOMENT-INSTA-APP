import express from 'express';
import { getMessage, sendMessage } from '../controllers/messageController.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const messageRouter = express.Router();

messageRouter.post('/send/:id',isAuthenticated , sendMessage);
messageRouter.get('/all/:id', isAuthenticated, getMessage);

export default messageRouter;