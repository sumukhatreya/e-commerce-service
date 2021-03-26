const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const middlewares = require('./errorHandlers');
const login = require('./routes/auth/login');
const register = require('./routes/auth/register');

const app = express();
app.use(helmet());
app.use(morgan('dev'));
// app.use(cors({
//     origin: process.env.CORS_ORIGIN
// }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
    res.json({
        message: "This should redirect to /products."
    }); 
});

// Auth routes
app.use('/login', login);
app.use('/register', register);

// Error handling
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;

