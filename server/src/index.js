const app = require('./app');
// const monk = require('monk');

const port = process.env.PORT || 5000;
// const dbUrl = process.env.DB_URL || 'http://localhost:5000/e-commerce-db';

app.listen(port, () => console.log(`Listening on port ${port}.`));