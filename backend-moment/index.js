import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import userRoute from './routes/userRoutes.js';
import postRouter from './routes/postRoute.js';
import messageRouter from './routes/messageRoute.js';
import storyRouter from './routes/storyRoute.js';
import { app, server } from './socket/socketIo.js'

dotenv.config();

const PORT = process.env.PORT || 3000;
//const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// cors
app.use(cors({
  origin: [ 'http://localhost:5173'], // match frontend
  credentials: true
}));

// routes
app.get('/', (req, res) => res.send('Server is Live!'));
app.use('/api/v1/user', userRoute);
app.use('/api/v1/post', postRouter);
app.use('/api/v1/message', messageRouter);
app.use('/api/v1/story', storyRouter);

// start server
await connectDB();

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

/*app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});*/
