import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoute from './routes/auth';
import roomRoute from './routes/room'
import bookingRoute from './routes/booking';
import userRoute from './routes/user';
import dashbordRoute from './routes/dashboard';
import emailRoute from './routes/email';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';
const app = express();
//middlewares
app.use(cors());
app.use(express.json());
// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoute);
app.use('/api/room', roomRoute);
app.use('/api/booking', bookingRoute);
app.use('/api/user', userRoute);
app.use('/api/dashboard', dashbordRoute);
app.use('/api/email', emailRoute);


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL as string)

mongoose.Promise = global.Promise;

mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

const PORT = process.env.PORT || 8000;
// Routes
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})