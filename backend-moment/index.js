import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import userRoute from './routes/userRoutes.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// cors
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// routes
app.get('/', (req, res) => res.send('Server is Live!'));
app.use('/api/v1/user', userRoute);

// start server
await connectDB();
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
