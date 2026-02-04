import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { addStory, getStories, viewStory, deleteStory } from '../controllers/storyController.js';
import upload from '../middleware/multer.js';

const storyRouter = express.Router();

storyRouter.post('/add', isAuthenticated, upload.single('image'), addStory);
storyRouter.get('/all', isAuthenticated, getStories);
storyRouter.post('/:id/view', isAuthenticated, viewStory);
storyRouter.delete('/:id', isAuthenticated, deleteStory);

export default storyRouter;