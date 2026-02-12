import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { addComment, addNewPost, bookMarkPost, deletePost, dislikePost, getAllPost, getCommentsOfPost, getUserPost, likePost } from '../controllers/postController.js';
import upload from '../middleware/multer.js';

const postRouter = express.Router();

postRouter.post('/addpost', isAuthenticated, upload.single('image'), addNewPost);
postRouter.get('/all', isAuthenticated, getAllPost);
postRouter.get('/userpost/all', isAuthenticated, getUserPost);
postRouter.get('/:id/like', isAuthenticated, likePost);
postRouter.get('/:id/dislike', isAuthenticated, dislikePost);
postRouter.post('/:id/comment', isAuthenticated, addComment);
postRouter.post('/:id/comment/all', isAuthenticated, getCommentsOfPost);
postRouter.delete('/delete/:id', isAuthenticated, deletePost);
postRouter.post('/:id/bookmark', isAuthenticated, bookMarkPost);

export default postRouter;