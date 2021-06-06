// Resource not found handler: sets status to 404 and forwards error to the error handler.
function notFound(req, res, next) {
    res.status(404);
    const error = new Error(`The following resource was not found: ${req.originalUrl}.`);
    next(error);
}

// The error handler. Sets the response object's status to the appropriate value, and responds with a json object with the error message and, if in development mode, the stack trace.
function errorHandler(err, req, res, next) {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    console.log('You have reached the error handler', err.message);
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? 'stack' : err.stack
    });
}

module.exports = {
    notFound,
    errorHandler
}
