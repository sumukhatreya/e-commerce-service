const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const middlewares = require('./middlewares');
const login = require('./routes/auth/login');
const register = require('./routes/auth/register');

const app = express();
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());


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

