import express from "express";
import { editProfile, followUnfollow, getProfile, getSuggestedUser, login, logout, register } from "../controllers/userController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import upload from "../middleware/multer.js";
// as we are using multer because, we are uploading files[image].

const userRoute = express.Router();

userRoute.post('/register', register);
userRoute.post('/login', login);
userRoute.get('/logout', logout);
userRoute.get('/:id/profile', isAuthenticated, getProfile );
userRoute.post('/profile/edit', isAuthenticated, upload.single('profilePicture'), editProfile );
userRoute.get('/suggested', isAuthenticated, getSuggestedUser);
userRoute.post('/followunfollow/:id',isAuthenticated, followUnfollow);

export default userRoute;