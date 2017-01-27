const AuthenticationController = require('./controllers/Authentication');
const BookController = require('./controllers/Book');

const express  = require('express');
const passport = require('passport');

const ROLE_MEMBER = require('./constants').ROLE_MEMBER;
const ROLE_CLIENT = require('./constants').ROLE_CLIENT;
const ROLE_OWNER  = require('./constants').ROLE_OWNER;
const ROLE_ADMIN  = require('./constants').ROLE_ADMIN;

const passportService = require('./config/passport');

// Middleware to require login/auth
const requireAuth  = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

module.exports = function(app) {
  const apiRoutes  = express.Router();
  const authRoutes = express.Router();
  const userRoutes = express.Router();
  const bookRoutes = express.Router();

  //= ========================
  // Auth Routes
  //= ========================
  apiRoutes.use('/auth', authRoutes);

  authRoutes.post('/register', AuthenticationController.register);
  authRoutes.post('/login', requireLogin, AuthenticationController.login);

  authRoutes.post('/forgot-password', AuthenticationController.forgotPassword);
  authRoutes.post('/reset-password/:token', AuthenticationController.verifyToken);

  //= ========================
  // Book Routes
  //= ========================
  apiRoutes.use('/book', bookRoutes);

  bookRoutes.get('/', BookController.getBooks);
  bookRoutes.post('/', BookController.postBook);

  bookRoutes.get('/:id', BookController.getBook);
  bookRoutes.put('/:id', BookController.updateBook);
  bookRoutes.delete('/:id', BookController.deleteBook);

  //= ========================
  // Api Routes
  //= ========================
  apiRoutes.get('/', function(req, res) {
    res.json({message: "Welcome to our Bookstore!"});
  });

  // Set url for API group routes
  app.use('/api', apiRoutes);
};
