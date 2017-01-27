require('dotenv').config();

const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const cors       = require('cors');
const logger     = require('morgan');
const mongoose   = require('mongoose');
const router     = require('./router');
const config     = require('./config/main');

// Database Setup
mongoose.connect(config.mongoURI[app.settings.env], function(err, res) {
  if(err) {
    console.log('Error connecting to the database. ' + err);
  } else {
    console.log('Connected to Database: ' + config.mongoURI[app.settings.env]);
  }
});

// Start The Server
let server;
if (process.env.NODE_ENV != 'test') {
  server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}.`);
  });
} else {
  server = app.listen(process.env.TEST_PORT);
}

// Middleware
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Router
router(app);

// Necessary for testing
module.exports = server;
