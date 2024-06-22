const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require('./routes/authRoutes');
const AppError = require('./utils/appError');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);

mongoose.connect('mongodb+srv://valo:valo123@valodealapp.mxkj6eb.mongodb.net/?retryWrites=true&w=majority&appName=valodealapp')
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Failed to connect to MongoDB:', error));

// Error handling middleware
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
