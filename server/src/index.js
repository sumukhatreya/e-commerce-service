const app = require('./app');
const mongoose = require('mongoose');

const port = process.env.PORT || 5000;
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/e-commerce-db';

// const db = monk(dbUrl);
// db.then(() => app.listen(port, () => {console.log(`Listening on port ${port}.`)}))
//   .catch(err => console.log("Error: ", err));

mongoose.connect(dbUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
  .then(() => app.listen(port, () => console.log(`Listening on port ${port}.`)))
  .catch(err => console.log('Error: ', err));