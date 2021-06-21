const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const middlewares = require('./errorHandlers');
const login = require('./routes/auth/login');
const register = require('./routes/auth/register');
const products = require('./routes/products');
const sell = require('./routes/sell');
const cart = require('./routes/cart/cart');

const app = express();
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
    res.cookie('myCookie', 'this is a cookie', { httpOnly: true, sameSite: 'strict'});
    res.json({
        message: "This should redirect to /products."
    }); 
});

// Auth routes
app.use('/login', login);
app.use('/register', register);

// Product routes
app.use('/products', products);
// app.use('/products/:id', productsid)

// Sell route
app.use('/sell', sell);

// Cart route
app.use('/cart', cart);


// Error handling
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;

