import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

dotenv.config({});

const PORT = process.env.PORT || 3000

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser); // to store token 
app.use(urlencoded({extended: true}));

const corsOption = {
    origin: 'http://localhost:5173',  // frontend origin
    credentials: true
}
app.use(cors(corsOption));

// routess
app.get('/', (req, res) => res.send('Server is Live!'));

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is listen on ${PORT}`);
})

